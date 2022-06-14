import { dayToMinutes, safeDivision } from "../utils/utils.time";

const AVG_WEEK_OF_MONTH = 4.345; //월 평균 주

// 이번달 해야하는 최소 근무시간
const getMinWorkingTime = ({ baseWorkingMinutes, holidayMinutes }) =>
    baseWorkingMinutes - holidayMinutes;

// 인정(?) 근로시간 = 소정 근무시간 + 연차 시간
const getTotalWorkingTime = ({ actualWorkingMinutes, timeOffMinutes }) =>
    actualWorkingMinutes + timeOffMinutes;

// 월 평균 주 근무 시간 (주)
const getWeekWorkingTimeAvg = ({ totalWorkingMinutes }) => {
    safeDivision(totalWorkingMinutes, AVG_WEEK_OF_MONTH);
};

// 현재 평균 소정 근무시간 (일)
const getCurrentWorkingMinutesAvg = ({ workedMinutes, workedDay }) =>
    safeDivision(workedMinutes, workedDay);

// 남은 최소 근무시간
const getMinRemainWorkingMinutes = ({ remainWorkingDay, workedMinutes }) =>
    dayToMinutes(remainWorkingDay) - workedMinutes;

// 남은 최소 근무시간 평균
const getMinRemainWorkingMinutesAvg = ({
    minRemainWorkingMinutes,
    remainWorkingDay,
}) => safeDivision(minRemainWorkingMinutes, remainWorkingDay);

const parseWorkingDay = (day) => {
    const { date, timeOffs, dayWorkingType, customHoliday } = day;
    /* 쉬는날 (반차 제외)
        customHoliday === true
        dayWorkingType === WEEKLY_PAID_HOLIDAY
    */
};

export {};
