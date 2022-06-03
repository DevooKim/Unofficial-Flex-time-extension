import { ResultData, TimeList, TimeListRest } from "../types";
import { filterCount } from "../utils/utils.list";

const parseTime = (): TimeList[] => {
    const tableRow = Array.from(
        document.getElementsByClassName("c-fEAhcH c-fTYJiF")
    );
    const timeList: TimeList[] = tableRow
        .map((row: Element) => {
            const cell = row.getElementsByClassName("PJLV c-fhRguj");
            const date =
                cell[0].getElementsByClassName("c-gqmpwD")[0].textContent || "";
            const holiday = cell[0].getElementsByClassName(
                "c-cOeAxU c-cOeAxU-kvhqpa-isCustomerHoliday-true"
            )[0];

            const time =
                cell[0].getElementsByClassName("c-juWfbq")[0].textContent || "";
            const timeType = Array.from(row.getElementsByTagName("span"));
            const full = timeType.find((v) => v.textContent === "연차");
            const half = timeType.find((v) => v.textContent === "반차");

            const rest: TimeListRest = full ? "full" : half ? "half" : "none";
            return { date, time, rest, isHoliday: !!holiday };
        })
        .filter(({ date, isHoliday }) => {
            if (isHoliday) {
                return false;
            }
            const reg = new RegExp(/[토|일]/);
            if (!date) return false;
            const isWeekend = reg.test(date);
            return !isWeekend;
        });

    return timeList;
};

const calculateTime = (timeList: TimeList[]): ResultData => {
    const rests = timeList.reduce(
        (prev: { date: string; type: string }[], cur: TimeList) => {
            if (cur.rest === "none") {
                return prev;
            }
            return [
                ...prev,
                {
                    date: cur.date,
                    type: cur.rest,
                },
            ];
        },
        []
    );

    const fullTimeRestCount = filterCount(rests, ({ type }) => type === "full");
    const halfTimeRestCount = filterCount(rests, ({ type }) => type === "half");

    const shouldWorkingDay = timeList.length - fullTimeRestCount;
    const remainWorkingDay = filterCount(
        timeList,
        ({ time }) => time === "0h" || time === "4h"
    );

    const minWorkingTime = shouldWorkingDay * 8 - halfTimeRestCount * 4;

    const currentWorkingTime: number = timeList.reduce(
        (workingTime: number, item: TimeList) => {
            const { time: timeString, rest } = item;
            const time: number = +timeString.slice(0, -1);

            //근무를 안했거나 연차인 경우 계산을 안한다.
            if (time === 0 || rest === "full") {
                return workingTime;
            }
            return workingTime + time - (rest === "half" ? 4 : 0); //반차인 경우 실 근무시간에서 4시간을 뺀다.
        },
        0
    );

    const currentWorkingTimeAvg =
        currentWorkingTime / (shouldWorkingDay - remainWorkingDay);

    const remainWorkingTime = minWorkingTime - currentWorkingTime;
    const remainWorkingTimeAvg = remainWorkingTime / remainWorkingDay;

    return {
        shouldWorkingDay,
        remainWorkingDay,
        minWorkingTime,
        currentWorkingTime,
        currentWorkingTimeAvg: +currentWorkingTimeAvg.toFixed(2),
        remainWorkingTime,
        remainWorkingTimeAvg: +remainWorkingTimeAvg.toFixed(2),
        rests,
    };
};

export { parseTime, calculateTime };
