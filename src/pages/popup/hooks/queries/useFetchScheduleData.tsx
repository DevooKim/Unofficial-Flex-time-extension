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
        queryKey: ['scheduleData', timeStamp, isCached],
        queryFn: async () => {
            let result = {} as flexScheduleData
            if (isCached) {
                const cachedData = (await browser.storage.session.get(
                    'scheduleData'
                )) as { scheduleData: flexScheduleData }

                try {
                    result = cachedData.scheduleData
                    if (!result) throw new Error('No data')
                } catch (error) {
                    const fetchData = await fetch(userIdHash, timeStamp)

                    console.log(fetchData, 'fetchData - error')

                    browser.storage.session.set({ scheduleData: fetchData })

                    result = fetchData
                }
            } else {
                const fetchData = await fetch(userIdHash, timeStamp)
                result = fetchData

                browser.storage.session.set({ scheduleData: fetchData })
            }

            return result
        },
    })
