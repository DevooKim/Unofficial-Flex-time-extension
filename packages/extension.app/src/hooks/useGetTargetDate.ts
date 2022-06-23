import { useEffect, useState } from 'react'
import { activeTabHandler } from '../chrome/utils'

const getTargetDate = (tab: chrome.tabs.Tab): Date => {
    const url = tab.url || ''
    const queryString = url.split('?')
    const UrlSearch = new URLSearchParams(queryString[1])
    const ts = UrlSearch.get('ts')

    let targetDate = new Date()
    if (ts) {
        targetDate = new Date(parseInt(ts as string, 10))
    }
    return targetDate
}

const useGetTargetDate = () => {
    const [targetMonth, setTargetMonth] = useState(0)
    const [targetTimeStamp, setTargetTimeStamp] = useState<string>('')

    const setDate = (targetDate: Date) => {
        setTargetTimeStamp(targetDate.getTime().toString())
        setTargetMonth(targetDate.getMonth() + 1)
    }

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, ({ isComplete }) => {
                if (isComplete) {
                    const targetDate = getTargetDate(tab)
                    setDate(targetDate)
                }
            })
        })
    }, [])

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true }
        chrome.tabs?.query(queryInfo, (tabs) => {
            const targetDate = getTargetDate(tabs[0])
            setDate(targetDate)
        })
    }, [])

    return { targetMonth, targetTimeStamp }
}

export default useGetTargetDate
