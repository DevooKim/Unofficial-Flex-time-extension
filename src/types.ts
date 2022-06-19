export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender;
    message: any;
}

export type TimeListRest = "FULL" | "HALF" | "HOLIDAY" | "NONE";

export type flexPaidSummary = {
    baseWorkingMinutes: number;
    workingHolidayMinutes: number;
    actualWorkingMinutes: number;
    timeOffMinutes: number;
};

export type flexDayInfo = {
    date: string;
    dayWorkingType:
        | "WORKING_DAY"
        | "WEEKLY_UNPAID_HOLIDAY"
        | "WEEKLY_PAID_HOLIDAY";
    customHoliday: boolean;
    timeOffs: {
        timeOffRegisterUnit: string;
    }[];
};

export interface flexInfo {
    paidSummary: flexPaidSummary;
    days: flexDayInfo[];
}

export type parsedDay = {
    date: string;
    workingDay: boolean;
    actualWorkingDay: boolean;
    timeOffType: TimeListRest;
};
