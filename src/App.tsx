import { blueGrey } from '@mui/material/colors'
import { Container } from '@mui/system'
import { useEffect, useMemo, useState } from 'react'
import { activeTabHandler, tabStatus } from './chrome/utils'
import InActive from './components/InActive'
import WorkingTimeResult from './components/WorkingTimeResult'
import { BaseTimeData } from './types'
import dayjs, { Dayjs } from 'dayjs'

function App() {
    const [tabStatus, setTabStatus] = useState<tabStatus>({
        isWorkingInfoTab: false,
        isComplete: false,
    })

    const baseTimeData: BaseTimeData = useMemo(() => {
        const day: Dayjs = dayjs()

        // 이번달의 처음날짜와 마지막 날짜 00:00
        const firstDay = day.startOf('month')
        const lastDay = dayjs(day.endOf('month').format('YYYY-MM-DD'))

        return {
            now: Number(day.valueOf()),
            firstDay: Number(firstDay.valueOf()),
            lastDay: Number(lastDay.valueOf()),
        }
    }, [])

    useEffect(() => {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            activeTabHandler(tab, setTabStatus)
        })
    }, [])

    useEffect(() => {
        const queryInfo = { active: true, currentWindow: true }
        chrome.tabs?.query(queryInfo, (tabs: chrome.tabs.Tab[]): void => {
            activeTabHandler(tabs[0], setTabStatus)
            return
        })
    }, [])

    return (
        <Container sx={{ minWidth: '350px', p: 1.5, background: blueGrey[50] }}>
            {tabStatus.isWorkingInfoTab ? (
                <WorkingTimeResult baseTimeData={baseTimeData} />
            ) : (
                <InActive />
            )}
        </Container>
    )
}

export default App
