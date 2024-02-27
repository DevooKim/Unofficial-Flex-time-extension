import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import browser from 'webextension-polyfill'

import { flexScheduleData } from '../types'
import { useBaseTimeContext } from '../pages/popup/contexts/BaseTimeContext'

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
    const {
        baseTimeData: { isCached, now },
    } = useBaseTimeContext()

    const [loading, setLoading] = useState<boolean>(true)
    const [workingData, setWorkingData] = useState<flexScheduleData>(
        {} as flexScheduleData
    )

    const fetchWorkingData = useCallback(async () => {
        if (userIdHash && timeStamp) {
            const 근무정보 = await fetch(userIdHash, timeStamp)
            browser.storage.session.set({ scheduleData: 근무정보 })
            setWorkingData(근무정보)
            setLoading(false)
        }
    }, [userIdHash, timeStamp])

    useEffect(() => {
        const cachedHandler = async () => {
            const cachedData = (await browser.storage.session.get(
                'scheduleData'
            )) as { scheduleData: flexScheduleData }

            if (cachedData.scheduleData) {
                setWorkingData(cachedData.scheduleData)
                setLoading(false)
            } else {
                fetchWorkingData()
            }
        }
        if (isCached) {
            cachedHandler()
        } else {
            fetchWorkingData()
        }
    }, [now, isCached, fetchWorkingData])

    return { loading, data: workingData }
}

export default useFetchScheduleData
