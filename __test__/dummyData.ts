import { flexInfo } from "../src/types";

// 공휴일 1일, 연차 1일, 반차 1일
export const data: flexInfo = {
    paidSummary: {
        baseWorkingMinutes: 10560,
        actualWorkingMinutes: 9701 - 240,
        timeOffMinutes: 480 + 240,
        workingHolidayMinutes: 480,
    },
    days: [
        {
            date: "2022-05-01",
            dayWorkingType: "WEEKLY_PAID_HOLIDAY",
            customHoliday: true,
            timeOffs: [],
        },
        {
            date: "2022-05-02",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [
                {
                    timeOffRegisterUnit: "HALF_DAY_PM",
                },
            ],
        },
        {
            date: "2022-05-03",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-04",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-05",
            dayWorkingType: "WORKING_DAY",
            customHoliday: true,
            timeOffs: [],
        },
        {
            date: "2022-05-06",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [
                {
                    timeOffRegisterUnit: "DAY",
                },
            ],
        },
        {
            date: "2022-05-07",
            dayWorkingType: "WEEKLY_UNPAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-08",
            dayWorkingType: "WEEKLY_PAID_HOLIDAY",
            customHoliday: true,
            timeOffs: [],
        },
        {
            date: "2022-05-09",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-10",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-11",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-12",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-13",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-14",
            dayWorkingType: "WEEKLY_UNPAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-15",
            dayWorkingType: "WEEKLY_PAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-16",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-17",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-18",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-19",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-20",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-21",
            dayWorkingType: "WEEKLY_UNPAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-22",
            dayWorkingType: "WEEKLY_PAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-23",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-24",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-25",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-26",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-27",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-28",
            dayWorkingType: "WEEKLY_UNPAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-29",
            dayWorkingType: "WEEKLY_PAID_HOLIDAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-30",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
        {
            date: "2022-05-31",
            dayWorkingType: "WORKING_DAY",
            customHoliday: false,
            timeOffs: [],
        },
    ],
};
