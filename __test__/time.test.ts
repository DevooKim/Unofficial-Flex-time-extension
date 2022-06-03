import { calculateTime } from "../src/services/time";
import { TimeList } from "../src/types";

describe("시간 계산이 잘 되는가", () => {
    const dummyTimeList: TimeList[] = [
        {
            date: "5. 1 (월)",
            time: "8h",
            rest: "full",
            isHoliday: false,
        },
        {
            date: "5. 2 (화)",
            time: "7h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 3 (수)",
            time: "7.5h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 4 (목)",
            time: "9h",
            rest: "half",
            isHoliday: false,
        },
        {
            date: "5. 5 (금)",
            time: "9h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 8 (월)",
            time: "12h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 9 (화)",
            time: "0h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 10 (수)",
            time: "0h",
            rest: "none",
            isHoliday: false,
        },
        {
            date: "5. 11 (목)",
            time: "8h",
            rest: "full",
            isHoliday: false,
        },
        {
            date: "5. 12 (금)",
            time: "4h",
            rest: "half",
            isHoliday: false,
        },
    ];

    const calcedTime = calculateTime(dummyTimeList);
    const {
        shouldWorkingDay,
        remainWorkingDay,
        minWorkingTime,
        currentWorkingTime,
        currentWorkingTimeAvg,
        remainWorkingTime,
        remainWorkingTimeAvg,
        rests,
    } = calcedTime;

    it("shouldWorkingDay", () => {
        expect(shouldWorkingDay).toBe(8);
    });
    it("remainWorkingDay", () => {
        expect(remainWorkingDay).toBe(3);
    });
    it("minWorkingTime", () => {
        expect(minWorkingTime).toBe(56);
    });
    it("currentWorkingTime", () => {
        expect(currentWorkingTime).toBe(40.5);
    });
    it("currentWorkingTimeAvg", () => {
        expect(currentWorkingTimeAvg).toBe(8.1);
    });
    it("remainWorkingTime", () => {
        expect(remainWorkingTime).toBe(15.5);
    });
    it("remainWorkingTimeAvg", () => {
        expect(remainWorkingTimeAvg).toBe(5.17);
    });
    it("rests", () => {
        expect(rests).toEqual([
            {
                date: "5. 1 (월)",
                type: "full",
            },
            {
                date: "5. 4 (목)",
                type: "half",
            },
            {
                date: "5. 11 (목)",
                type: "full",
            },
            {
                date: "5. 12 (금)",
                type: "half",
            },
        ]);
    });
});
export {};
