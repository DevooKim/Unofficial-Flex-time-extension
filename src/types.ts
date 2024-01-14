export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender
    message: any
}

export interface BaseTimeData {
    now: number
    today: number
    firstDay: number
    lastDay: number
    isCached: boolean
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

export type flexScheduleData = {
    paidSummary: flexPaidSummary
    timeOffSummary: { timeOffResults: timeOffResult[] }
    days: flexDayInfo[]
    period: { applyTimeRangeTo: number; applyTimeRangeFrom: number }
}

export type myScheduleData = {
    워킹데이: number
    최소근무시간: number
    근무시간총합: number
    남은근무일: number
    남은근무시간: number
    남은평균근무시간: number
    휴가정보list: {
        date: string
        infos: {
            name: string
            minutes: number
            hours: number
        }[]
        totalMinutes: number
        totalHours: number
    }[]
    timestampTo: number
    timestampFrom: number
    지금기준: {
        남은근무일: number
        남은근무시간: number
        남은평균근무시간: number
    }
}

export type flexClockData = {
    records: {
        appliedDate: string
        workClockRecordPacks: {
            startRecord: {
                eventType: string
                targetTime: number
                customerWorkFormId: string
                recordType: 'RECORD' | 'PLAY_BY_AUTO'
                zoneId: string
            }
            switchRecords: any[]
            stopRecord: {
                eventType: string
                targetTime: number
                recordType: 'RECORD' | 'PLAY_BY_AUTO'
                zoneId: string
            }
            restRecords: {
                restStartRecord: {
                    eventType: string
                    customerWorkFormId: string
                    targetTime: number
                    recordType: 'RECORD' | 'PLAY_BY_AUTO'
                    zoneId: string
                }
                restStopRecord: {
                    eventType: string
                    targetTime: number
                    recordType: 'RECORD' | 'PLAY_BY_AUTO'
                    zoneId: string
                }
            }[]
            onGoing: boolean
        }[]
        appliedZoneId: string
    }[]
}

export type myClockData = {
    현재근무상태: '출근전' | '근무중' | '퇴근'
    출근시간: number
    퇴근시간: number
    오늘일한시간: number
}
