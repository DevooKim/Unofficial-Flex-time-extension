import axios from "axios";
import { useEffect, useState } from "react";
import {
    getCurrentWorkingMinutesAvg,
    getMinWorkingTime,
    getTotalWorkingTime,
    getWeekWorkingTimeAvg,
    getWorkingDayCount,
    parseWorkingDay,
    getMinRemainWorkingMinutes,
    getMinRemainWorkingMinutesAvg,
} from "../service/calc";
import { flexInfo } from "../types";

const fetch = async (
    userIdHash: string,
    timeStamp: string,
    callback: (res: any) => void
) => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    );
    const flexData: flexInfo = data.workScheduleResults[0];

    const minWorkingMinutes = getMinWorkingTime(flexData.paidSummary);
    const totalWorkingMinutes = getTotalWorkingTime(flexData.paidSummary);
    const weekWorkingMinutesAvg = getWeekWorkingTimeAvg(totalWorkingMinutes);

    // const actualWorkingMinutes = flexData.paidSummary.actualWorkingMinutes;
    // const actualWorkingMinutesAvg = getCurrentWorkingMinutesAvg({
    //     workedDay: workedDayCount,
    //     workedMinutes: actualWorkingMinutes,
    // });

    // const minRemainWorkingMinutes = getMinRemainWorkingMinutes({
    //     minWorkingMinutes,
    //     workedMinutes: totalWorkingMinutes,
    // });
    // const minRemainWorkingMinutesAvg = getMinRemainWorkingMinutesAvg({
    //     minRemainWorkingMinutes,
    //     remainWorkingDay: workingDayCount - workedDayCount,
    // });

    // callback(data.workScheduleResults[0]);
};

const useFetchWorkingData = (userIdHash: string, timeStamp: string) => {
    const [workingData, setWorkingData] = useState({});

    useEffect(() => {
        if (userIdHash && timeStamp) {
            fetch(userIdHash, timeStamp, setWorkingData);
        }
    }, [userIdHash, timeStamp]);

    return workingData;
};

export default useFetchWorkingData;
