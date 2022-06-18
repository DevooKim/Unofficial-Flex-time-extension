import { flexDayInfo, flexPaidSummary, parsedWorkingDay } from "../types";
import { dayToMinutes, safeDivision } from "../utils/utils.time";

const AVG_WEEK_OF_MONTH = 4.345; //월 평균 주

// 이번달 해야하는 최소 근무시간
export const getMinWorkingTime = ({
    baseWorkingMinutes,
    timeOffMinutes,
    workingHolidayMinutes,
}: flexPaidSummary): number =>
    baseWorkingMinutes - timeOffMinutes - workingHolidayMinutes;

// 인정(?) 근로시간 = 소정 근무시간 + 연차 시간
export const getTotalWorkingTime = ({
    actualWorkingMinutes,
    timeOffMinutes,
}: flexPaidSummary): number => actualWorkingMinutes + timeOffMinutes;

// 월 평균 주 근무 시간 (주)
export const getWeekWorkingTimeAvg = (totalWorkingMinutes: number): number =>
    safeDivision(totalWorkingMinutes, AVG_WEEK_OF_MONTH);

// 현재 평균 소정 근무시간 (일)
export const getCurrentWorkingMinutesAvg = ({
    workedMinutes,
    workedDay,
}: any): number => safeDivision(workedMinutes, workedDay);

// 남은 최소 근무시간
export const getMinRemainWorkingMinutes = ({
    minWorkingMinutes,
    workedMinutes,
}: any): number => {
    const result = minWorkingMinutes - workedMinutes;
    return result < 0 ? 0 : result;
};

// 남은 최소 근무시간 평균
export const getMinRemainWorkingMinutesAvg = ({
    minRemainWorkingMinutes,
    remainWorkingDay,
}: any): number => safeDivision(minRemainWorkingMinutes, remainWorkingDay);

export const getDaysInfo = ({
    dayWorkingType,
    customHoliday,
    timeOffs,
}: flexDayInfo): parsedWorkingDay => {
    if (
        customHoliday ||
        dayWorkingType === "WEEKLY_UNPAID_HOLIDAY" ||
        dayWorkingType === "WEEKLY_PAID_HOLIDAY"
    ) {
        return { isWorkingDay: false, timeOffType: "FULL" };
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
        isWorkingDay: !(isDayOff || isHalfDayOff),
        timeOffType: isDayOff ? "FULL" : isHalfDayOff ? "HALF" : "NONE",
    };
};

/* 근무 정보 */
export const parseWorkingDay = (day: flexDayInfo): parsedWorkingDay => {
    const { isWorkingDay, timeOffType } = getDaysInfo(day);

    return {
        date: day.date,
        isWorkingDay,
        timeOffType,
    };
};

export const getWorkingDayCount = (parsedDays: parsedWorkingDay[]): number => {
    const workingDays = parsedDays.filter(({ isWorkingDay }) => isWorkingDay);

    const halfTimeOffDay = parsedDays.filter(
        ({ timeOffType }) => timeOffType === "HALF"
    );

    return workingDays.length + halfTimeOffDay.length * 0.5;
};

/* TODO: 초과시간 */
