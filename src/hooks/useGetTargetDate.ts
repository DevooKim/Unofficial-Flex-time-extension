import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'

const useGetTargetDate = () => {
    const [targetDate, setTargetDate] = useState(dayjs())
    const [targetTimeStamp, setTargetTimeStamp] = useState<string>(
        dayjs().endOf('month').valueOf().toString()
    )
    const setDateByDayjs = (day: Dayjs) => {
        setTargetDate(day)
        setTargetTimeStamp(day.valueOf().toString())
    }
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

    return {
        targetDate,
        targetTimeStamp,
        setNextMonth,
        setPrevMonth,
        setDateByDayjs,
    }
}

export default useGetTargetDate
