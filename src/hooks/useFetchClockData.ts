import { useEffect, useState } from 'react'
import axios from 'axios'

import { flexClockData } from '../types'
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
    const { isCached } = useBaseTimeContext()

    const [loading, setLoading] = useState<boolean>(true)
    const [clockData, setClockData] = useState<flexClockData>(
        {} as flexClockData
    )
    const fetchClockData = async () => {
        if (userIdHash && timeStampFrom && timeStampTo) {
            const 근무시간정보 = await fetch(
                userIdHash,
                timeStampFrom,
                timeStampTo
            )

            chrome.storage.session.set({ clockData: 근무시간정보 })

            setClockData(근무시간정보)
            setLoading(false)
        }
    }

    useEffect(() => {
        if (isCached) {
            chrome.storage.session.get('clockData', (result) => {
                if (result.clockData) {
                    setClockData(result.clockData)
                    setLoading(false)
                } else {
                    fetchClockData()
                }
            })
        } else {
            fetchClockData()
        }
    }, [isCached, userIdHash, timeStampFrom, timeStampTo])

    return { loading, data: clockData }
}

export default useFetchClockData
