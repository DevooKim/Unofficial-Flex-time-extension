import { ResultData, TimeList, TimeListRest, ResultDataRest } from "../types";
import { filterCount } from "../utils/utils.list";

const getTimeTrackingTypes = (
    timeTrackingBlock: Element
): (string | null)[] => {
    const childNodes = Array.from(timeTrackingBlock.childNodes);
    const trackingTypes = childNodes.map((v) => v.textContent);
    return trackingTypes;
};

const analyzeTrackingType = (types: (string | null)[]): TimeListRest => {
    const isOnlyWorkingDay = types.every(
        (type) => type === "근무" || type === "휴게"
    );

    if (isOnlyWorkingDay) {
        return "none";
    }

    const isHalfWorkingDay = !!filterCount(types, (type) => type === "근무");

    return isHalfWorkingDay ? "half" : "full";
};

const parseTime = (): TimeList[] => {
    const tableRow = Array.from(
        document.getElementsByClassName("c-fEAhcH c-fTYJiF")
    );
    const timeList: TimeList[] = tableRow
        .map((row: Element) => {
            const timeCell = row.getElementsByClassName("PJLV c-fhRguj");
            const date =
                timeCell[0].getElementsByClassName("c-gqmpwD")[0].textContent ||
                "";
            const holiday = timeCell[0].getElementsByClassName(
                "c-cOeAxU c-cOeAxU-kvhqpa-isCustomerHoliday-true"
            )[0];

            const workingTime =
                timeCell[0].getElementsByClassName("c-juWfbq")[0].textContent ||
                "";
            const timeBlock = row.getElementsByClassName("c-houiWd");
            const timeTrackingTypes = getTimeTrackingTypes(timeBlock[0]);

            const restType = analyzeTrackingType(timeTrackingTypes);

            return {
                date,
                time: workingTime,
                restType,
                isHoliday: !!holiday,
            };
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
            if (cur.restType === "none") {
                return prev;
            }
            return [
                ...prev,
                {
                    date: cur.date,
                    type: cur.restType,
                },
            ];
        },
        []
    );

    const fullTimeRestCount = filterCount<ResultDataRest>(
        rests,
        ({ type }) => type === "full"
    );
    const halfTimeRestCount = filterCount<ResultDataRest>(
        rests,
        ({ type }) => type === "half"
    );

    const shouldWorkingDay = timeList.length - fullTimeRestCount;
    const remainWorkingDay = filterCount(
        timeList,
        ({ time }) => time === "0h" || time === "4h"
    );

    const minWorkingTime = shouldWorkingDay * 8 - halfTimeRestCount * 4;

    const currentWorkingTime: number = timeList.reduce(
        (workingTime: number, item: TimeList) => {
            const { time: timeString, restType } = item;
            const time: number = +timeString.slice(0, -1);

            //근무를 안했거나 연차인 경우 계산을 안한다.
            if (time === 0 || restType === "full") {
                return workingTime;
            }
            return workingTime + time - (restType === "half" ? 4 : 0); //반차인 경우 실 근무시간에서 4시간을 뺀다.
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

export { parseTime, calculateTime, analyzeTrackingType };
