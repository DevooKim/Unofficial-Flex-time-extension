import { useEffect, useState } from 'react'
import { activeTabHandler } from '../chrome/utils'

const getTimeStampFromQuery = (tab: chrome.tabs.Tab): string | null => {
    const url = tab.url || ''
    const queryString = url.split('?')
    const UrlSearch = new URLSearchParams(queryString[1])
    const ts = UrlSearch.get('ts')

    return ts
}

const useGetTargetDate = () => {
    const [targetDate, setTargetDate] = useState(new Date())
    const [targetTimeStamp, setTargetTimeStamp] = useState<string>('')

    const setDate = (timestamp: string) => {
        setTargetTimeStamp(timestamp)
        setTargetDate(new Date(parseInt(timestamp as string, 10)))
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
        const newDate = targetDate
        newDate.setMonth(targetDate.getMonth() + 1)
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.getTime().toString())
    }
    const setPrevMonth = () => {
        const newDate = targetDate
        newDate.setMonth(targetDate.getMonth() - 1)
        setTargetDate(newDate)
        setTargetTimeStamp(newDate.getTime().toString())
    }

    return { targetDate, targetTimeStamp, setNextMonth, setPrevMonth }
}

export default useGetTargetDate
