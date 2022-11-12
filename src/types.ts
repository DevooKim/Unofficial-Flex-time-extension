export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender
    message: any
}

export type flexPaidSummary = {
    baseWeeklyPaidHolidayMinutes: number
    baseWorkingMinutes: number
    workingHolidayMinutes: number
    actualWorkingMinutes: number
    timeOffMinutes: number
}

export type flexDayInfo = {
    date: string
    dayWorkingType:
        | 'WORKING_DAY'
        | 'WEEKLY_UNPAID_HOLIDAY'
        | 'WEEKLY_PAID_HOLIDAY'
    customHoliday: boolean
    workRecords: any[]
    timeOffs: {
        timeOffPolicyId: string
        usedMinutes: string
    }[]
}

export type timeOffResult = {
    timeOffPolicyId: string
    name: string
}

export type flexInfo = {
    paidSummary: flexPaidSummary
    timeOffSummary: { timeOffResults: timeOffResult[] }
    days: flexDayInfo[]
    period: { to: string }
}

export type parsedData = {
    workingDaysOfMonth: number
    minWorkingHoursOfMonth: string
    actualWorkingHours: string
    currentTotalWorkingHours: string
    minRemainWorkingHours: string
    timeOffs: {
        date: string
        infos: {
            name: string
            minutes: number
            hours?: string
        }[]
        totalMinutes: number
        totalHours?: string
    }[]
}
