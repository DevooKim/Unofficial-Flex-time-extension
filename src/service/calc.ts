import { flexDayInfo, flexPaidSummary } from "../types";
import { dayToMinutes, safeDivision } from "../utils/utils.time";

const AVG_WEEK_OF_MONTH = 4.345; //월 평균 주

// 이번달 해야하는 최소 근무시간
export const getMinWorkingTime = ({
    baseWorkingMinutes,
    holidayMinutes,
}: flexPaidSummary): number => baseWorkingMinutes - holidayMinutes;

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
}): number => safeDivision(workedMinutes, workedDay);

// 남은 최소 근무시간
export const getMinRemainWorkingMinutes = ({
    remainWorkingDay,
    workedMinutes,
}): number => dayToMinutes(remainWorkingDay) - workedMinutes;

// 남은 최소 근무시간 평균
export const getMinRemainWorkingMinutesAvg = ({
    minRemainWorkingMinutes,
    remainWorkingDay,
}): number => safeDivision(minRemainWorkingMinutes, remainWorkingDay);

export const getDaysInfo = ({
    dayWorkingType,
    customHoliday,
    timeOffs,
}: flexDayInfo) => {
    if (
        customHoliday ||
        dayWorkingType === "WEEKLY_UNPAID_HOLIDAY" ||
        dayWorkingType === "WEEKLY_PAID_HOLIDAY`"
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
        isWorkingDay: isDayOff || isHalfDayOff,
        timeOffType: isDayOff ? "FULL" : isHalfDayOff ? "HALF" : "NONE",
    };
};

/* 근무일 (반차 포함) */
export const parseWorkingDay = (days: flexDayInfo) => {
    const { isWorkingDay, timeOffType } = getDaysInfo(days);

    return {
        date: days.date,
        isWorkingDay,
        timeOffType,
    };
};

/* TODO: 초과시간 */
