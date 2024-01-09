import isEmpty from 'lodash/isEmpty'
import dayjs from 'dayjs'

import {
    flexDayInfo,
    flexScheduleData,
    flexPaidSummary,
    myScheduleData,
    myClockData,
    BaseTimeData,
} from '../types'

const convertMinuteToHours = (minute: number): number => minute / 60

const 워킹데이계산하기 = (days: flexScheduleData['days']) => {
    const 워킹데이목록 = days.filter(({ customHoliday, dayWorkingType }) => {
        if (customHoliday) {
            return false
        }

        if (dayWorkingType === 'WORKING_DAY') {
            return true
        }

        return false
    })

    return 워킹데이목록.length
}

/**
 * 지금까지의 근무시간 정보
 * @return actualWorkingHours: 실제 근무 시간, timeOffHours: 연차 시간
 */
const 근무시간계산하기 = ({
    actualWorkingMinutes: 실제근무시간,
    timeOffMinutes: 연차시간,
}: Pick<flexPaidSummary, 'actualWorkingMinutes' | 'timeOffMinutes'>): {
    실제근무시간: number
    연차시간: number
} => {
    return {
        실제근무시간: convertMinuteToHours(실제근무시간),
        연차시간: convertMinuteToHours(연차시간),
    }
}

/**
 * 남은 최소 근무시간
 * @param 이번달워킹데이 워킹데이
 * @param 근무시간총합 지금까지 근무한 시간 (연차 포함)
 */
const 남은근무시간계산하기 = ({
    워킹데이,
    근무시간총합,
}: {
    워킹데이: number
    근무시간총합: number
}): number => Math.max(워킹데이 * 8 - 근무시간총합, 0)

/**
 * 연차 정보
 */
const 휴가정보구하기 = (
    timeOffPolicyIdMap: { [key: string]: string },
    dayInfo: flexDayInfo
): myScheduleData['휴가정보list'][number] => {
    const { date, timeOffs } = dayInfo

    const 요일맵: { [key: string]: string } = {
        0: '(일)',
        1: '(월)',
        2: '(화)',
        3: '(수)',
        4: '(목)',
        5: '(금)',
        6: '(토)',
    }

    const 요일 = 요일맵[dayjs(date).day().toString()]

    const infos = timeOffs.map((timeOff) => {
        const minutes = Number(timeOff.usedMinutes)
        return {
            name: timeOffPolicyIdMap[timeOff.timeOffPolicyId],
            minutes,
            hours: minutes / 60,
        }
    })

    const totalMinutes = infos.reduce((prev, cur) => prev + cur.minutes, 0)

    return {
        date: `${date} ${요일}`,
        infos,
        totalMinutes,
        totalHours: totalMinutes / 60,
    }
}

export const parseScheduleData = ({
    data,
    baseTimeData,
    clockData,
}: {
    data: flexScheduleData
    baseTimeData: BaseTimeData
    clockData: myClockData
}): myScheduleData => {
    const days = data.days
    const period = data.period
    const summary = data.paidSummary
    const timeOffResults = data.timeOffSummary.timeOffResults

    /** 이번달 워킹데이 */
    const 워킹데이 = 워킹데이계산하기(days)

    /** 근무시간 정보 */
    const { 실제근무시간, 연차시간 } = 근무시간계산하기(summary)

    /** 지금까지 총 근무시간 */
    const 근무시간총합 = 실제근무시간 + 연차시간

    /** 남은 최소 근무시간 */
    const 남은근무시간 = 남은근무시간계산하기({
        워킹데이,
        근무시간총합,
    })

    const 휴가IdMap = timeOffResults.reduce(
        (prev, timeOffResult) => ({
            ...prev,
            ...{ [timeOffResult.timeOffPolicyId]: timeOffResult.name },
        }),
        {}
    )

    const 휴가list = days
        .filter(({ timeOffs }) => !isEmpty(timeOffs))
        .map((day) => 휴가정보구하기(휴가IdMap, day))

    const { today } = baseTimeData
    const offset = clockData.현재근무상태 === '퇴근' ? 60 * 60 * 24 * 1000 : 0

    const filterDays = ({ date }: { date: string }) =>
        dayjs(date).valueOf() >= today + offset

    const 남은워킹데이 = 워킹데이계산하기(days.filter(filterDays))
    const 오늘이후휴가일수 = 휴가list
        .filter(filterDays)
        .reduce((acc, cur) => acc + cur.totalHours / 8, 0)

    const 남은근무일 = 남은워킹데이 - 오늘이후휴가일수
    const 남은평균근무시간 = 남은근무시간 / 남은근무일 || 0

    const 남은근무일_지금기준 =
        clockData.현재근무상태 === '출근 전' ? 남은근무일 - 1 : 남은근무일
    const 남은근무시간_지금기준 =
        clockData.현재근무상태 === '근무 중'
            ? 남은근무시간 - clockData.오늘일한시간
            : 남은근무시간
    const 남은평균근무시간_지금기준 =
        남은근무시간_지금기준 / 남은근무일_지금기준 || 0

    return {
        워킹데이,
        최소근무시간: 워킹데이 * 8,
        근무시간총합,
        남은근무일,
        남은근무시간,
        남은평균근무시간,
        휴가정보list: 휴가list,
        timestampTo: period.applyTimeRangeTo,
        timestampFrom: period.applyTimeRangeFrom,
        지금기준: {
            남은근무일: 남은근무일_지금기준,
            남은근무시간: 남은근무시간_지금기준,
            남은평균근무시간: 남은평균근무시간_지금기준,
        },
    }
}
