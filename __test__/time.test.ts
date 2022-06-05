import {
    calculateTime,
    analyzeTrackingType,
} from "../src/chrome/services/time";
import { TimeList } from "../src/types";

describe("시간 계산이 잘 되는가", () => {
    const dummyTimeList: TimeList[] = [
        {
            date: "5. 1 (월)",
            time: "8h",
            restType: "full",
            isHoliday: false,
        },
        {
            date: "5. 2 (화)",
            time: "7h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 3 (수)",
            time: "7.5h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 4 (목)",
            time: "9h",
            restType: "half",
            isHoliday: false,
        },
        {
            date: "5. 5 (금)",
            time: "9h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 8 (월)",
            time: "12h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 9 (화)",
            time: "0h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 10 (수)",
            time: "0h",
            restType: "none",
            isHoliday: false,
        },
        {
            date: "5. 11 (목)",
            time: "8h",
            restType: "full",
            isHoliday: false,
        },
        {
            date: "5. 12 (금)",
            time: "4h",
            restType: "half",
            isHoliday: false,
        },
    ];

    const calculatedTime = calculateTime(dummyTimeList);
    const {
        shouldWorkingDay,
        remainWorkingDay,
        minWorkingTime,
        currentWorkingTime,
        currentWorkingTimeAvg,
        remainWorkingTime,
        remainWorkingTimeAvg,
        rests,
    } = calculatedTime;

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

describe("연차 계산이 잘 되는가", () => {
    it("일반적인 근무일 때 type은 none", () => {
        const dummy = ["근무", "휴게", "근무", "근무"];
        const result = analyzeTrackingType(dummy);
        expect(result).toBe("none");
    });

    it("근무가 없을 때 type은 full", () => {
        const dummy = ["여러 종류의 연차1", "여러 종류의 연차2"];
        const result = analyzeTrackingType(dummy);
        expect(result).toBe("full");
    });

    it("근무와 휴게외 또다른 무언가가 있다면 half", () => {
        const dummy = ["근무", "휴게", "여러 종류의 연차"];
        const result = analyzeTrackingType(dummy);
        expect(result).toBe("half");
    });
});
export {};
