import axios from 'axios'
import { useEffect, useState } from 'react'
import { flexInfo, parsedData } from '../types'
import { parseData } from '../components/WorkingTimeResult.utils'

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
): {
    loading: boolean
    data: parsedData
} => {
    const [loading, setLoading] = useState<boolean>(true)
    const [workingData, setWorkingData] = useState<parsedData>({} as parsedData)

    useEffect(() => {
        if (userIdHash && timeStamp) {
            const fetchWorkingData = async () => {
                const 근무정보 = await fetch(userIdHash, timeStamp)
                const parsedData = parseData(근무정보)
                setWorkingData(parsedData)
                setLoading(false)
            }

            fetchWorkingData()
        }
    }, [userIdHash, timeStamp])

    return { loading, data: workingData }
}

export default useFetchWorkingData
