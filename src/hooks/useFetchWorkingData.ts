import axios from "axios";
import { useEffect, useState } from "react";

const fetch = async (
    userIdHash: string,
    timeStamp: string,
    callback: (res: any) => void
) => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    );

    callback(data.workScheduleResults[0]);
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
