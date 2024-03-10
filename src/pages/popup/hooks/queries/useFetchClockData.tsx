import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'
import browser from 'webextension-polyfill'

import { flexClockData } from '@src/types'

type UseFetchClockData = {
    userIdHash: string
    timeStampFrom: number
    timestampTo: number
    isCached: boolean
}

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

export const useFetchClockData = ({
    userIdHash,
    timeStampFrom,
    timestampTo,
    isCached,
}: UseFetchClockData) =>
    useSuspenseQuery({
        queryKey: ['clockData', timeStampFrom, timestampTo, isCached],
        queryFn: async () => {
            let result = {} as flexClockData

            if (isCached) {
                const cachedData = (await browser.storage.session.get(
                    'clockData'
                )) as { clockData: flexClockData }

                try {
                    result = cachedData.clockData
                } catch (error) {
                    const fetchData = await fetch(
                        userIdHash,
                        timeStampFrom,
                        timestampTo
                    )

                    browser.storage.session.set({ clockData: fetchData })

                    result = fetchData
                }
            } else {
                const fetchData = await fetch(
                    userIdHash,
                    timeStampFrom,
                    timestampTo
                )

                browser.storage.session.set({ clockData: fetchData })

                result = fetchData
            }

            return result
        },
    })
