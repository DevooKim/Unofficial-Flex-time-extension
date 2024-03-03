import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'
import browser from 'webextension-polyfill'

import { flexScheduleData } from '@src/types'

type UseFetchClockData = {
    userIdHash: string
    timeStamp: number
    isCached: boolean
}

const fetch = async (
    userIdHash: string,
    timeStamp: number
): Promise<flexScheduleData> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStamp}&timeStampTo=${timeStamp}`
    )
    return data.workScheduleResults[0]
}

export const useFetchScheduleData = ({
    userIdHash,
    timeStamp,
    isCached,
}: UseFetchClockData) =>
    useSuspenseQuery({
        queryKey: ['userIdHash', timeStamp, isCached],
        queryFn: async () => {
            let result = {} as flexScheduleData
            if (isCached) {
                const cachedData = (await browser.storage.session.get(
                    'userIdHash'
                )) as { userIdHash: flexScheduleData }

                try {
                    result = cachedData.userIdHash
                } catch (error) {
                    const fetchData = await fetch(userIdHash, timeStamp)

                    browser.storage.session.set({ userIdHash: fetchData })

                    result = fetchData
                }
            } else {
                const fetchData = await fetch(userIdHash, timeStamp)
                result = fetchData

                browser.storage.session.set({ userIdHash: fetchData })
            }

            return result
        },
    })
