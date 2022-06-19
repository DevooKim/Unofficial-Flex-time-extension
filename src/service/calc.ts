import { flexDayInfo, flexPaidSummary, parsedDay, workingDay } from "../types";
import { safeDivision } from "../utils/utils.time";

const AVG_WEEK_OF_MONTH = 4.345; //월 평균 주

// 이번달 해야하는 최소 근무시간
export const getMinWorkingMinutes = (actualWorkingDayCount: number): number =>
    actualWorkingDayCount * 8 * 60;

// 인정(?) 근로시간 = 소정 근무시간 + 연차 시간
export const getTotalWorkingMinutes = ({
    actualWorkingMinutes,
    timeOffMinutes,
}: flexPaidSummary): number => actualWorkingMinutes + timeOffMinutes;

// 월 평균 주 근무 시간 (주)
export const getWorkingMinutesWeekAvg = (totalWorkingMinutes: number): number =>
    safeDivision(totalWorkingMinutes, AVG_WEEK_OF_MONTH);

// 현재 평균 소정 근무시간 (일)
export const getCurrentWorkingMinutesAvg = ({
    workedMinutes,
    workedDay,
}: {
    workedMinutes: number;
    workedDay: number;
}): number => safeDivision(workedMinutes, workedDay);

// 남은 최소 근무시간
export const getMinRemainWorkingMinutes = ({
    minWorkingMinutes,
    workedMinutes,
}: {
    minWorkingMinutes: number;
    workedMinutes: number;
}): number => {
    const result = minWorkingMinutes - workedMinutes;
    return result < 0 ? 0 : result;
};

// 남은 최소 근무시간 평균
export const getMinRemainWorkingMinutesAvg = ({
    minRemainWorkingMinutes,
    remainActualWorkingDayCount,
}: {
    minRemainWorkingMinutes: number;
    remainActualWorkingDayCount: number;
}): number =>
    safeDivision(minRemainWorkingMinutes, remainActualWorkingDayCount);

export const getDaysInfo = ({
    date,
    dayWorkingType,
    customHoliday,
    timeOffs,
}: flexDayInfo): parsedDay => {
    if (
        customHoliday ||
        dayWorkingType === "WEEKLY_UNPAID_HOLIDAY" ||
        dayWorkingType === "WEEKLY_PAID_HOLIDAY"
    ) {
        return {
            date,
            workingDay: false,
            actualWorkingDay: false,
            timeOffType: "HOLIDAY",
        };
    }

    const isDayOff = timeOffs.some(
        ({ timeOffRegisterUnit }) => timeOffRegisterUnit === "DAY"
    );
    const isHalfDayOff = timeOffs.some(
        ({ timeOffRegisterUnit }) =>
            timeOffRegisterUnit === "HALF_DAY_PM" ||
            timeOffRegisterUnit === "HALF_DAY_AM"
    );

    return {
        date,
        workingDay: true,
        actualWorkingDay: !isDayOff, // 반차는 출근일로 계산
        timeOffType: isDayOff ? "FULL" : isHalfDayOff ? "HALF" : "NONE",
    };
};

/* 근무 정보 */
export const parseWorkingDay = (day: flexDayInfo): parsedDay => {
    const { workingDay, actualWorkingDay, timeOffType } = getDaysInfo(day);

    return {
        date: day.date,
        workingDay,
        actualWorkingDay,
        timeOffType,
    };
};

// 이번달 실 출근일 (연차제외 반차: 0.5)
export const getWorkingDayCount = (parsedDays: parsedDay[]): number => {
    const workingDays = parsedDays.filter(({ workingDay }) => workingDay);

    const halfTimeOffDay = parsedDays.filter(
        ({ timeOffType }) => timeOffType === "HALF"
    );

    return workingDays.length - halfTimeOffDay.length * 0.5;
};

export const isWorkedDay = (
    workingDay: parsedDay,
    includeToday: boolean = false
): boolean => {
    const today = new Date().toISOString().split("T")[0];
    return includeToday ? today >= workingDay.date : today > workingDay.date;
};

export const getWorkingDay = (days: flexDayInfo[]): workingDay => {
    const parsedDays = days.map((day) => getDaysInfo(day));

    // 근무일(연차 포함)
    const workingDays = parsedDays.filter(
        ({ timeOffType }) => timeOffType !== "HOLIDAY"
    );
    const workingDayCount = workingDays.length;

    // 연차
    const timeOffDays = workingDays.filter(
        ({ timeOffType }) => timeOffType !== "NONE"
    );

    // 출근일 (연차 제외))
    const actualWorkingDays = parsedDays.filter(
        ({ actualWorkingDay }) => actualWorkingDay
    );
    const actualWorkingDayCount = getWorkingDayCount(actualWorkingDays);

    // 근무한 일 (연차 포함)
    const workedDays = workingDays.filter((workedDay) =>
        isWorkedDay(workedDay)
    );
    const workedDayCount = workedDays.length;

    // 출근한 일 (연차 제외)
    const actualWorkedDays = workedDays.filter(
        ({ actualWorkingDay }) => actualWorkingDay
    );
    const actualWorkedDayCount = getWorkingDayCount(actualWorkedDays);

    return {
        workingDays,
        workingDayCount,
        timeOffDays,
        actualWorkingDays,
        actualWorkingDayCount,
        workedDays,
        workedDayCount,
        actualWorkedDays,
        actualWorkedDayCount,
    };
};

export const minutesToHour = (minutes: number): number =>
    Number((minutes / 60).toFixed(2));

/* TODO: 초과시간 */
