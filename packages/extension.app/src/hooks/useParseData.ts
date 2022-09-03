import { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import {
    getMinRemainWorkingHours,
    getTimeOffIdMap,
    getTimeOffInfo,
    getWorkingDaysOfMonth,
    getWorkingInfoUntilNow,
} from '../service/workingCalc'

import { flexInfo, parsedData } from '../types'

const hourToString = (time: number): string => {
    const hour = Math.floor(time)
    const min = Math.round(+(time % 1).toFixed(2) * 60)
    return `${hour}시간 ${min}분`
}

const useParseData = (flexData: flexInfo) => {
    const [data, setData] = useState({} as parsedData)

    useEffect(() => {
        if (isEmpty(flexData)) {
            return
        }
        const days = flexData.days
        const period = flexData.period
        const summary = flexData.paidSummary
        const timeOffResults = flexData.timeOffSummary.timeOffResults

        /** 이번달 워킹데이 */
        const workingDaysOfMonth = getWorkingDaysOfMonth(days, period.to)

        /** 근무시간 정보 */
        const { actualWorkingHours, timeOffHours } =
            getWorkingInfoUntilNow(summary)

        /** 지금까지 총 근무시간 */
        const currentTotalWorkingHours = actualWorkingHours + timeOffHours

        /** 남은 최소 근무시간 */
        const minRemainWorkingHours = getMinRemainWorkingHours({
            workingDaysOfMonth,
            currentTotalWorkingHours,
        })

        const timeOffIdMap = getTimeOffIdMap(timeOffResults)
        const getTimeOffInfoWrapper = getTimeOffInfo(timeOffIdMap)

        const timeOffs = days
            .filter(({ timeOffs }) => !isEmpty(timeOffs))
            .map((day) => {
                const { date, infos, totalMinutes } = getTimeOffInfoWrapper(day)
                const _infos = infos.map((info) => ({
                    ...info,
                    hours: hourToString(info.minutes / 60),
                }))
                return {
                    date,
                    infos: _infos,
                    totalMinutes,
                    totalHours: hourToString(totalMinutes / 60),
                }
            })

        setData({
            workingDaysOfMonth,
            minWorkingHoursOfMonth: hourToString(workingDaysOfMonth * 8),
            actualWorkingHours: hourToString(actualWorkingHours),
            currentTotalWorkingHours: hourToString(currentTotalWorkingHours),
            minRemainWorkingHours: hourToString(minRemainWorkingHours),
            timeOffs,
        })
    }, [flexData])

    return data
}

export default useParseData
