import isEmpty from 'lodash/isEmpty'

import { flexDayInfo, flexInfo, flexPaidSummary, parsedData } from '../types'

const convertMinuteToHours = (minute: number): number => minute / 60

const 워킹데이계산하기 = (days: flexInfo['days'], endDate: string) => {
    /** 이번달 휴일 */
    const holidayLength = days.filter(({ customHoliday, dayWorkingType }) => {
        if (customHoliday) {
            return true
        }

        if (
            dayWorkingType === 'WEEKLY_PAID_HOLIDAY' ||
            dayWorkingType === 'WEEKLY_UNPAID_HOLIDAY'
        ) {
            return true
        }

        return false
    }).length

    /** 이번달 일 수 */
    const dayLength = new Date(endDate).getDate()
    return dayLength - holidayLength
}

/**
 * 이번달 근무해야하는 일 수
 * @param workingDaysOfMonth 이번달 워킹데이 수
 * @param holidayOfMonth 이번달 휴일 수
 */
const getActualWorkingDaysOfMonth = (
    workingDaysOfMonth: number,
    holidaysOfMonth: number
): number => workingDaysOfMonth - holidaysOfMonth

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
): parsedData['휴가정보list'][number] => {
    const { date, timeOffs } = dayInfo

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
        date,
        infos,
        totalMinutes,
        totalHours: totalMinutes / 60,
    }
}

export const parseData = (flexData: flexInfo): parsedData => {
    const days = flexData.days
    const period = flexData.period
    const summary = flexData.paidSummary
    const timeOffResults = flexData.timeOffSummary.timeOffResults

    /** 이번달 워킹데이 */
    const 워킹데이 = 워킹데이계산하기(days, period.to)

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

    return {
        워킹데이: 워킹데이,
        // 이번달최소근무시간: hourToString(이번달워킹데이 * 8),
        최소근무시간: 워킹데이 * 8,
        // actualWorkingHours: hourToString(실제근무시간),
        // 현재근무시간: hourToString(현재근무한시간),
        근무시간총합,
        // 남은최소근무시간: hourToString(남은근무시간),
        남은근무시간,
        휴가정보list: 휴가list,
    }
}
