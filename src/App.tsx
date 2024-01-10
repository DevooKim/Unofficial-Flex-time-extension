import { blueGrey } from '@mui/material/colors'
import { Container } from '@mui/system'
import { useEffect, useMemo } from 'react'
import { activeTabHandler } from './chrome/utils'
import WorkingTimeResult from './components/WorkingTimeResult'
import { BaseTimeData } from './types'
import dayjs, { Dayjs } from 'dayjs'

function App() {
    const baseTimeData: BaseTimeData = useMemo(() => {
        const day: Dayjs = dayjs()

        // 이번달의 처음날짜와 마지막 날짜 00:00
        const firstDay = day.startOf('month')
        const lastDay = dayjs(day.endOf('month').format('YYYY-MM-DD'))

        return {
            now: Number(day.valueOf()),
            today: Number(day.startOf('day').valueOf()),
            firstDay: Number(firstDay.valueOf()),
            lastDay: Number(lastDay.valueOf()),
        }
    }, [])

    return (
        <Container sx={{ minWidth: '350px', p: 1.5, background: blueGrey[50] }}>
            <WorkingTimeResult baseTimeData={baseTimeData} />
        </Container>
    )
}

export default App
