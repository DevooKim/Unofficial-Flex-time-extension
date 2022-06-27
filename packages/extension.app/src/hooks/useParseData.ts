import { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import {
    getMinRemainWorkingMinutesAvg,
    getCurrentWorkingMinutesAvg,
    getMinRemainWorkingMinutes,
    getWorkingDay,
    getMinWorkingMinutes,
    getTotalWorkingMinutes,
    getWorkingMinutesWeekAvg,
    minutesToHour,
} from '../service/calc'
import { flexInfo, parsedData } from '../types'

const useParseData = (flexData: flexInfo): parsedData => {
    const [data, setData] = useState({} as parsedData)

    useEffect(() => {
        if (isEmpty(flexData)) {
            return
        }
        const days = flexData.days
        const summary = flexData.paidSummary

        const {
            timeOffDays,
            actualWorkingDayCount,
            actualWorkedDayCount,
            finishToday,
        } = getWorkingDay(days)
        const remainActualWorkingDayCount =
            actualWorkingDayCount - actualWorkedDayCount

        const minWorkingMinutes = getMinWorkingMinutes(actualWorkingDayCount)
        const totalWorkingMinutes = getTotalWorkingMinutes(summary)
        const workingMinutesWeekAvg =
            getWorkingMinutesWeekAvg(totalWorkingMinutes)
        const actualWorkingMinutes = summary.actualWorkingMinutes
        const actualWorkingMinutesAvg = getCurrentWorkingMinutesAvg({
            actualWorkedDay: actualWorkedDayCount,
            workedMinutes: actualWorkingMinutes,
        })

        const minRemainWorkingMinutes = getMinRemainWorkingMinutes({
            minWorkingMinutes,
            workedMinutes: actualWorkingMinutes,
        })
        const minRemainWorkingMinutesAvg = getMinRemainWorkingMinutesAvg({
            minRemainWorkingMinutes,
            remainActualWorkingDayCount,
        })

        setData({
            actualWorkingDayCount,
            remainActualWorkingDayCount,
            timeOffDays,
            minWorkingTime: minutesToHour(minWorkingMinutes),
            totalWorkingTime: minutesToHour(totalWorkingMinutes),
            workingTimeWeekAvg: minutesToHour(workingMinutesWeekAvg),
            actualWorkingTime: minutesToHour(actualWorkingMinutes),
            actualWorkingTimeAvg: minutesToHour(actualWorkingMinutesAvg),
            minRemainWorkingTime: minutesToHour(minRemainWorkingMinutes),
            minRemainWorkingTimeAvg: minutesToHour(minRemainWorkingMinutesAvg),
            finishToday,
        })
    }, [flexData])

    return data
}

export default useParseData
