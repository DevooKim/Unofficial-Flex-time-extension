import dayjs, { Dayjs } from 'dayjs'
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import { BaseTimeData } from '@src/types'

import LoadingUI from '@popup/components/LoadingUI'

const CACHE_TIME_SEC = 60

type BaseTimeProviderProps = {
    children: JSX.Element
}

type BaseTimeContextType = {
    baseTimeData: BaseTimeData
    refreshBaseTimeForce: () => void
    refreshBaseTimeIfInvalid: () => void
}

const BaseTimeContext = createContext<BaseTimeContextType>(
    {} as BaseTimeContextType
)

export const useBaseTimeContext = (): BaseTimeContextType =>
    useContext(BaseTimeContext)

const isValidCache = (cacheTime: number, day: Dayjs) =>
    cacheTime &&
    dayjs(cacheTime).diff(Number(day.valueOf()), 'second') <= CACHE_TIME_SEC

const BaseTimeProvider = ({ children }: BaseTimeProviderProps) => {
    const [baseTimeData, setBaseTimeData] = useState<BaseTimeData>(
        {} as BaseTimeData
    )

    const [loading, setLoading] = useState(true)

    const updateCacheData = useCallback((day: Dayjs) => {
        const now = Number(day.valueOf())

        setLoading(true)
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
    }, [])

    const refreshBaseTimeForce = useCallback(() => {
        const day: Dayjs = dayjs().second(0).millisecond(0)
        updateCacheData(day)
    }, [updateCacheData])

    const refreshBaseTimeIfInvalid = useCallback(() => {
        const day: Dayjs = dayjs().second(0).millisecond(0)

        chrome.storage.session.get('cacheTime', (result) => {
            const cacheTime = result.cacheTime

            if (isValidCache(cacheTime, day)) {
                updateCacheData(day)
            }
        })
    }, [updateCacheData])

    useEffect(() => {
        const day: Dayjs = dayjs().second(0).millisecond(0)

        chrome.storage.session.get('cacheTime', (result) => {
            const cacheTime = result.cacheTime

            if (isValidCache(cacheTime, day)) {
                chrome.storage.session.get('baseTimeData', (cacheTimeData) => {
                    setBaseTimeData({
                        ...cacheTimeData.baseTimeData,
                        isCached: true,
                    })
                    setLoading(false)
                })
            } else {
                updateCacheData(day)
            }
        })
    }, [updateCacheData])

    if (loading) return <LoadingUI />

    return (
        <BaseTimeContext.Provider
            value={{
                baseTimeData,
                refreshBaseTimeForce,
                refreshBaseTimeIfInvalid,
            }}
        >
            {children}
        </BaseTimeContext.Provider>
    )
}

export default BaseTimeProvider
