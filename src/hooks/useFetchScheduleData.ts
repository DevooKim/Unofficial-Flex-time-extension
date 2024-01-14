import { useEffect, useState } from 'react'
import axios from 'axios'
import { flexScheduleData } from '../types'
import { useBaseTimeContext } from '../contexts/BaseTimeContext'

const fetch = async (
    userIdHash: string,
    timeStamp: string
): Promise<flexScheduleData> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    )
    return data.workScheduleResults[0]
}

const useFetchScheduleData = ({
    userIdHash,
    timeStamp,
}: {
    userIdHash: string
    timeStamp: string
}): {
    loading: boolean
    data: flexScheduleData
} => {
    const { isCached } = useBaseTimeContext()

    const [loading, setLoading] = useState<boolean>(true)
    const [workingData, setWorkingData] = useState<flexScheduleData>(
        {} as flexScheduleData
    )

    const fetchWorkingData = async () => {
        if (userIdHash && timeStamp) {
            const 근무정보 = await fetch(userIdHash, timeStamp)
            chrome.storage.session.set({ scheduleData: 근무정보 }, () => {})
            setWorkingData(근무정보)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isCached) {
            chrome.storage.session.get('scheduleData', (result) => {
                if (result.scheduleData) {
                    setWorkingData(result.scheduleData)
                    setLoading(false)
                } else {
                    fetchWorkingData()
                }
            })
        } else {
            fetchWorkingData()
        }
    }, [isCached, userIdHash, timeStamp])

    return { loading, data: workingData }
}

export default useFetchScheduleData
