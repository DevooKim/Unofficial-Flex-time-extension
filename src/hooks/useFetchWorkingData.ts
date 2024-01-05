import axios from 'axios'
import { useEffect, useState } from 'react'
import { flexInfo } from '../types'

const fetch = async (
    userIdHash: string,
    timeStamp: string
): Promise<flexInfo> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    )
    return data.workScheduleResults[0]
}

const useFetchWorkingData = (
    userIdHash: string,
    timeStamp: string
): flexInfo => {
    const [workingData, setWorkingData] = useState<flexInfo>({} as flexInfo)

    useEffect(() => {
        if (userIdHash && timeStamp) {
            const fetchWorkingData = async () => {
                const 근무정보 = await fetch(userIdHash, timeStamp)
                setWorkingData(근무정보)
            }

            fetchWorkingData()
        }
    }, [userIdHash, timeStamp])

    return workingData
}

export default useFetchWorkingData
