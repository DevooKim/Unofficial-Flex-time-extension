import { useEffect, useState } from 'react'
import axios from 'axios'

import { flexClockData, myClockData } from '../types'
import { parseClockData } from '../utils/parseClockData'

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

const useFetchClockData = (
    userIdHash: string,
    {
        timeStampFrom,
        timeStampTo,
    }: { timeStampFrom: number; timeStampTo: number }
): {
    loading: boolean
    data: myClockData
} => {
    const [loading, setLoading] = useState<boolean>(true)
    const [clockData, setClockData] = useState<myClockData>({} as myClockData)

    useEffect(() => {
        if (userIdHash && timeStampFrom && timeStampTo) {
            const fetchClockData = async () => {
                const 근무시간정보 = await fetch(
                    userIdHash,
                    timeStampFrom,
                    timeStampTo
                )

                const parsedClockData = parseClockData({
                    data: 근무시간정보,
                    now: Date.now(),
                })

                setClockData(parsedClockData)
                setLoading(false)
            }

            fetchClockData()
        }
    }, [userIdHash, timeStampFrom, timeStampTo])

    return { loading, data: clockData }
}

export default useFetchClockData
