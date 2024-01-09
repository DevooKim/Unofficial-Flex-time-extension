import axios from 'axios'
import { useEffect, useState } from 'react'
import { flexScheduleData } from '../types'

const fetch = async (
    userIdHash: string,
    timeStamp: string
): Promise<flexScheduleData> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    )
    return data.workScheduleResults[0]
}

const useFetchScheduleData = (
    userIdHash: string,
    timeStamp: string
): {
    loading: boolean
    data: flexScheduleData
} => {
    const [loading, setLoading] = useState<boolean>(true)
    const [workingData, setWorkingData] = useState<flexScheduleData>(
        {} as flexScheduleData
    )

    useEffect(() => {
        if (userIdHash && timeStamp) {
            const fetchWorkingData = async () => {
                const 근무정보 = await fetch(userIdHash, timeStamp)
                setWorkingData(근무정보)
                setLoading(false)
            }

            fetchWorkingData()
        }
    }, [userIdHash, timeStamp])

    return { loading, data: workingData }
}

export default useFetchScheduleData
