import { useEffect, useState } from 'react'

const DEFAULT_WORKING_HOURS = 8

export const useWorkingHoursSettings = (
    baseAgreedDayWorkingMinutes?: number
) => {
    const [workingHours, setWorkingHours] = useState<number>(
        DEFAULT_WORKING_HOURS
    )
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        chrome.storage.local.get(['workingHoursPerDay'], (result) => {
            if (result.workingHoursPerDay !== undefined) {
                setWorkingHours(result.workingHoursPerDay)
            } else if (baseAgreedDayWorkingMinutes) {
                // storage에 값이 없으면 baseAgreedDayWorkingMinutes 사용
                const hours = baseAgreedDayWorkingMinutes / 60
                setWorkingHours(hours)
            }
            // 둘 다 없으면 DEFAULT_WORKING_HOURS 사용
            setIsLoading(false)
        })
    }, [baseAgreedDayWorkingMinutes])

    const updateWorkingHours = (hours: number) => {
        chrome.storage.local.set({ workingHoursPerDay: hours }, () => {
            setWorkingHours(hours)
        })
    }

    const resetWorkingHours = () => {
        chrome.storage.local.remove('workingHoursPerDay', () => {
            const hours = baseAgreedDayWorkingMinutes
                ? baseAgreedDayWorkingMinutes / 60
                : DEFAULT_WORKING_HOURS
            setWorkingHours(hours)
        })
    }

    return { workingHours, updateWorkingHours, resetWorkingHours, isLoading }
}
