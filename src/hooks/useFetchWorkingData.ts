import axios from "axios";
import { useEffect, useState } from "react";

const fetch = async <T>(
    userIdHash: string,
    timeStamp: string,
    callback: (res: any) => void
) => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    );
    const flexData: T = data.workScheduleResults[0];

    callback(flexData);
};

const useFetchWorkingData = <T>(userIdHash: string, timeStamp: string): T => {
    const [workingData, setWorkingData] = useState<T>({} as T);

    useEffect(() => {
        if (userIdHash && timeStamp) {
            fetch<T>(userIdHash, timeStamp, setWorkingData);
        }
    }, [userIdHash, timeStamp]);

    return workingData;
};

export default useFetchWorkingData;
