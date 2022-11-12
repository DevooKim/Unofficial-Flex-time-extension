import {
    flexDayInfo,
    flexInfo,
    flexPaidSummary,
    parsedData,
    timeOffResult,
} from '../types'

/**
 * 제공할 정보
 * 이번달 워킹데이 (공휴일 제외)
 * 지금까지의 총 근무시간 (연차 포함)
 * 지금까지의 소정 근무시간 (연차 제외): 지금까지의 총 근무시간 - 연차 시간
 * 남은 최소 근무시간: 이번달 근무일 * 8 - 지금까지의 총 근무시간
 * 연차 정보
 */

const convertMinuteToHours = (minute: number): number => minute / 60

export const getWorkingDaysOfMonth = (
    days: flexInfo['days'],
    endDate: string
) => {
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
export const getActualWorkingDaysOfMonth = (
    workingDaysOfMonth: number,
    holidaysOfMonth: number
): number => workingDaysOfMonth - holidaysOfMonth

/**
 * 지금까지의 근무시간 정보
 * @return actualWorkingHours: 소정 근무 시간, timeOffHours: 연차 시간
 */
export const getWorkingInfoUntilNow = ({
    actualWorkingMinutes,
    timeOffMinutes,
}: Pick<flexPaidSummary, 'actualWorkingMinutes' | 'timeOffMinutes'>): {
    actualWorkingHours: number
    timeOffHours: number
} => {
    return {
        actualWorkingHours: convertMinuteToHours(actualWorkingMinutes),
        timeOffHours: convertMinuteToHours(timeOffMinutes),
    }
}

/**
 * 남은 최소 근무시간
 * @param workingDaysOfMonth 워킹데이
 * @param currentTotalWorkingHours 지금까지 근무한 시간 (연차 포함)
 */
export const getMinRemainWorkingHours = ({
    workingDaysOfMonth,
    currentTotalWorkingHours,
}: {
    workingDaysOfMonth: number
    currentTotalWorkingHours: number
}): number => Math.max(workingDaysOfMonth * 8 - currentTotalWorkingHours, 0)

export const getTimeOffIdMap = (timeOffResults: timeOffResult[]) =>
    timeOffResults.reduce(
        (prev, timeOffResult) => ({
            ...prev,
            ...{ [timeOffResult.timeOffPolicyId]: timeOffResult.name },
        }),
        {}
    )

/**
 * 연차 정보
 */
export const getTimeOffInfo =
    (timeOffPolicyIdMap: { [key: string]: string }) =>
    (dayInfo: flexDayInfo): parsedData['timeOffs'][number] => {
        const { date, timeOffs } = dayInfo

        const infos = timeOffs.map((timeOff) => ({
            name: timeOffPolicyIdMap[timeOff.timeOffPolicyId],
            minutes: +timeOff.usedMinutes,
        }))

        const totalMinutes = infos.reduce((prev, cur) => prev + cur.minutes, 0)

        return {
            date,
            infos,
            totalMinutes,
        }
    }
