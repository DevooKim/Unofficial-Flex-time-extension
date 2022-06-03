export enum Sender {
    React,
    Content,
}

export interface ChromeMessage {
    from: Sender;
    message: any;
}

type TimeListRest = "full" | "half" | "none";

export interface TimeList {
    date: string;
    time: string;
    rest: TimeListRest;
    isHoliday?: boolean;
}

export interface ResultData {
    shouldWorkingDay: number; // 이번달 해야하는 근무일(출근일) (연차 제외, 반차 1일 포함)
    minWorkingTime: number; // 이번달 해야하는 최소 근무 시간 (연차 제외, 반차 4시간 포함)
    currentWorkingTime: number; // 소정 근무시간
    currentWorkingTimeAvg: number; // 소정 근무시간 / 근무일
    remainWorkingDay: number; // 이번달 남은 근무일(출근일) (연차 제외, 반차 포함)
    remainWorkingTime: number; // 남은 최소 근무시간
    remainWorkingTimeAvg: number; // 남은 평균 근무시간 (연차 제외, 반차 1일 포함)
    rests: {
        date: string;
        type: string;
    }[];
}

export type { TimeListRest };
