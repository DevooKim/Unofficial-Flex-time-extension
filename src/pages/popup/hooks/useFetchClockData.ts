import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

import { flexClockData } from '../../../types'
import { useBaseTimeContext } from '../contexts/BaseTimeContext'

const fetch = async (
    userIdHash: string,
    timeStampFrom: number,
    timestampTo: number
): Promise<flexClockData> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/work-clock/users?userIdHashes=${userIdHash}&timeStampFrom=${timeStampFrom}&timeStampTo=${timestampTo}`
    )

    return data.records[0]
}

const useFetchClockData = ({
    userIdHash,
    timeStampFrom,
    timeStampTo,
}: {
    userIdHash: string
    timeStampFrom: number
    timeStampTo: number
}): {
    loading: boolean
    data: flexClockData
} => {
    const {
        baseTimeData: { isCached, now },
    } = useBaseTimeContext()

    const [loading, setLoading] = useState<boolean>(true)
    const [clockData, setClockData] = useState<flexClockData>(
        {} as flexClockData
    )
    const fetchClockData = useCallback(async () => {
        if (userIdHash && timeStampFrom && timeStampTo) {
            const 근무시간정보 = await fetch(
                userIdHash,
                timeStampFrom,
                timeStampTo
            )

            browser.storage.session.set({ clockData: 근무시간정보 })

            setClockData(근무시간정보)
            setLoading(false)
        }
    }, [userIdHash, timeStampFrom, timeStampTo])

    useEffect(() => {
        const cachedHandler = async () => {
            const cachedData = (await browser.storage.session.get(
                'clockData'
            )) as { clockData: flexClockData }

            if (cachedData.clockData) {
                setClockData(cachedData.clockData)
                setLoading(false)
            } else {
                fetchClockData()
            }
        }

        if (isCached) {
            cachedHandler()
        } else {
            fetchClockData()
        }
    }, [now, isCached, fetchClockData])

    return { loading, data: clockData }
}

export default useFetchClockData
