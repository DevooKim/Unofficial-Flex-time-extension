import { useEffect, useState } from 'react'
import { activeTabHandler } from '../chrome/utils'
import dayjs, { Dayjs } from 'dayjs'

const getTimeStampFromQuery = (tab: chrome.tabs.Tab): string | null => {
    const url = tab.url || ''
    const queryString = url.split('?')
    const UrlSearch = new URLSearchParams(queryString[1])
    const ts = UrlSearch.get('ts')

    return ts
}

const useGetTargetDate = () => {
    const [targetDate, setTargetDate] = useState(dayjs())
    const [targetTimeStamp, setTargetTimeStamp] = useState<string>(
        dayjs().endOf('month').valueOf().toString()
    )

    const setDateByTimestamp = (timestamp: string) => {
        setTargetTimeStamp(timestamp)
        setTargetDate(dayjs(parseInt(timestamp as string, 10)))
    }

    const setDateByDayjs = (day: Dayjs) => {
        setTargetDate(day)
        setTargetTimeStamp(day.valueOf().toString())
    }

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, ({ isComplete }) => {
                if (isComplete) {
                    const ts = getTimeStampFromQuery(tab)
                    if (ts) {
                        setDateByTimestamp(ts)
                    }
                }
            })
        })
    }, [])

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true }
        chrome.tabs?.query(queryInfo, (tabs) => {
            const ts = getTimeStampFromQuery(tabs[0])
            if (ts) {
                setDateByTimestamp(ts)
            }
        })
    }, [])

    const setNextMonth = () => {
        const newDate = targetDate.clone().month(targetDate.get('month') + 1)
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.valueOf().toString())
    }
    const setPrevMonth = () => {
        const newDate = targetDate.clone().month(targetDate.get('month') - 1)
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.valueOf().toString())
    }

    console.log({ targetTimeStamp })

    return {
        targetDate,
        targetTimeStamp,
        setNextMonth,
        setPrevMonth,
        setDateByDayjs,
    }
}

export default useGetTargetDate
