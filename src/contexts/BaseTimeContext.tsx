import { createContext, useContext, useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

import { BaseTimeData } from '../types'
import { CACHE_TIME_SEC } from '../constants'

const BaseTimeContext = createContext<BaseTimeData>({} as BaseTimeData)

export const useBaseTimeContext = (): BaseTimeData => {
    return useContext(BaseTimeContext)
}

const BaseTimeProvider = ({ children }: any) => {
    const [baseTimeData, setBaseTimeData] = useState<BaseTimeData>(
        {} as BaseTimeData
    )

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const day: Dayjs = dayjs()
        const now = Number(day.valueOf())

        chrome.storage.session.get('cacheTime', (result) => {
            const cacheTime = result.cacheTime

            if (
                cacheTime &&
                dayjs(now).diff(dayjs(cacheTime), 'second') <= CACHE_TIME_SEC
            ) {
                chrome.storage.session.get('baseTimeData', (cacheTimeData) => {
                    setBaseTimeData({
                        ...cacheTimeData.baseTimeData,
                        isCached: true,
                    })
                    setLoading(false)
                })
            } else {
                // 이번달의 처음날짜와 마지막 날짜 00:00
                const firstDay = day.startOf('month')
                const lastDay = dayjs(day.endOf('month').format('YYYY-MM-DD'))

                const data = {
                    now: Number(day.valueOf()),
                    today: Number(day.startOf('day').valueOf()),
                    firstDay: Number(firstDay.valueOf()),
                    lastDay: Number(lastDay.valueOf()),
                }

                chrome.storage.session.set({ baseTimeData: data })
                chrome.storage.session.set({ cacheTime: now })
                setBaseTimeData({ ...data, isCached: false })
                setLoading(false)
            }
        })
    }, [])

    if (loading) return <div>loading</div>

    return (
        <BaseTimeContext.Provider value={baseTimeData}>
            {children}
        </BaseTimeContext.Provider>
    )
}

export default BaseTimeProvider
