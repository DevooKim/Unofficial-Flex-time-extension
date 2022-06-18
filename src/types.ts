export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender;
    message: any;
}

export type TimeListRest = "FULL" | "HALF" | "NONE";

export type flexPaidSummary = {
    baseWorkingMinutes: number;
    holidayMinutes: number;
    actualWorkingMinutes: number;
    timeOffMinutes: number;
};

export type flexDayInfo = {
    date: string;
    dayWorkingType: string;
    customHoliday: boolean;
    timeOffs: {
        timeOffRegisterUnit: string;
    }[];
};

export interface flexInfo {
    paidSummary: flexPaidSummary;
    days: flexDayInfo[];
}
