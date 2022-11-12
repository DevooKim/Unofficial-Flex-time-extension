import { useEffect, useState } from 'react'
import { activeTabHandler } from '../chrome/utils'
import dayjs from 'dayjs'

const getTimeStampFromQuery = (tab: chrome.tabs.Tab): string | null => {
    const url = tab.url || ''
    const queryString = url.split('?')
    const UrlSearch = new URLSearchParams(queryString[1])
    const ts = UrlSearch.get('ts')

    return ts
}

const useGetTargetDate = () => {
    const [targetDate, setTargetDate] = useState(dayjs())
    const [targetTimeStamp, setTargetTimeStamp] = useState<string>('')

    const setDate = (timestamp: string) => {
        setTargetTimeStamp(timestamp)
        setTargetDate(dayjs(parseInt(timestamp as string, 10)))
    }

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, ({ isComplete }) => {
                if (isComplete) {
                    const ts = getTimeStampFromQuery(tab)
                    if (ts) {
                        setDate(ts)
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
                setDate(ts)
            }
        })
    }, [])

    const setNextMonth = () => {
        const newDate = dayjs().month(targetDate.get('month') + 1)
        console.log(newDate.valueOf())
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.valueOf().toString())
    }
    const setPrevMonth = () => {
        const newDate = dayjs().month(targetDate.get('month') - 1)
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.valueOf().toString())
    }

    return { targetDate, targetTimeStamp, setNextMonth, setPrevMonth }
}

export default useGetTargetDate
