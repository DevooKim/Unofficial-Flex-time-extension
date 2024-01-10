import { useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
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

const useFetchScheduleData = ({
    userIdHash,
    timeStamp,
    now,
}: {
    userIdHash: string
    timeStamp: string
    now: number
}): {
    loading: boolean
    data: flexScheduleData
} => {
    const [loading, setLoading] = useState<boolean>(true)
    const [workingData, setWorkingData] = useState<flexScheduleData>(
        {} as flexScheduleData
    )

    const fetchWorkingData = async () => {
        if (userIdHash && timeStamp) {
            const 근무정보 = await fetch(userIdHash, timeStamp)
            chrome.storage.session.set({ scheduleData: 근무정보 }, () => {})
            chrome.storage.session.set(
                { cacheTime: { scheduleData: now } },
                () => {}
            )
            setWorkingData(근무정보)
            setLoading(false)
        }
    }

    useEffect(() => {
        chrome.storage.session.get('cacheTime', (result) => {
            const cacheTime = result.cacheTime?.scheduleData

            if (dayjs(cacheTime).diff(dayjs(now), 'minute') <= 1) {
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
        })
    }, [userIdHash, timeStamp])

    return { loading, data: workingData }
}

export default useFetchScheduleData
