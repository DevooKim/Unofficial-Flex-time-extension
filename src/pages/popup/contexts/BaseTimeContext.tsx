import dayjs from 'dayjs'
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
    updateCacheData: () => void
    refreshBaseTimeIfInvalid: () => void
}

type CACHE_KEY = 'baseTimeData' | 'cacheTime'

const BaseTimeContext = createContext<BaseTimeContextType>(
    {} as BaseTimeContextType
)

export const useBaseTimeContext = (): BaseTimeContextType =>
    useContext(BaseTimeContext)

const isValidCache = (cacheTime: number) =>
    cacheTime &&
    dayjs(Number(dayjs().second(0).millisecond(0).valueOf())).diff(
        cacheTime,
        'second'
    ) < CACHE_TIME_SEC

const cache = {
    get: (key: CACHE_KEY) =>
        new Promise((resolve) => {
            chrome.storage.session.get(key, (result) => {
                resolve(result[key])
            })
        }),
    set: (key: CACHE_KEY, value: unknown) =>
        new Promise((resolve) => {
            chrome.storage.session.set({ [key]: value }, () => {
                resolve(value)
            })
        }),
}

const BaseTimeProvider = ({ children }: BaseTimeProviderProps) => {
    const [baseTimeData, setBaseTimeData] = useState<BaseTimeData>(
        {} as BaseTimeData
    )

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const a = async () => {
            const cacheTime = (await cache.get('cacheTime')) as number

            if (isValidCache(cacheTime)) {
                const cacheTimeData = (await cache.get(
                    'baseTimeData'
                )) as BaseTimeData

                setBaseTimeData({ ...cacheTimeData, isCached: true })
                setLoading(false)
            } else {
                updateCacheData()
            }
        }

        a()
    }, [])

    const updateCacheData = useCallback(() => {
        const day = dayjs().second(0).millisecond(0)

        setLoading(true)
        const firstDay = day.startOf('month')
        const lastDay = dayjs(day.endOf('month').format('YYYY-MM-DD'))

        const data = {
            now: Number(day.valueOf()),
            today: Number(day.startOf('day').valueOf()),
            firstDay: Number(firstDay.valueOf()),
            lastDay: Number(lastDay.valueOf()),
        }

        cache.set('baseTimeData', data)
        cache.set('cacheTime', Number(day.valueOf()))

        setBaseTimeData({ ...data, isCached: false })
        setLoading(false)
    }, [])

    const refreshBaseTimeIfInvalid = useCallback(async () => {
        const cacheTime = (await cache.get('cacheTime')) as number

        if (!isValidCache(cacheTime)) {
            updateCacheData()
        }
    }, [updateCacheData])

    if (loading) return <LoadingUI />

    return (
        <BaseTimeContext.Provider
            value={{
                baseTimeData,
                updateCacheData,
                refreshBaseTimeIfInvalid,
            }}
        >
            {children}
        </BaseTimeContext.Provider>
    )
}

export default BaseTimeProvider
