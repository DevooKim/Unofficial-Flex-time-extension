import { useEffect, useState } from 'react'

const DEFAULT_WORKING_HOURS = 8

export const useWorkingHoursSettings = () => {
    const [workingHours, setWorkingHours] = useState<number>(
        DEFAULT_WORKING_HOURS
    )
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        chrome.storage.local.get(['workingHoursPerDay'], (result) => {
            if (result.workingHoursPerDay !== undefined) {
                setWorkingHours(result.workingHoursPerDay)
            }
            setIsLoading(false)
        })
    }, [])

    const updateWorkingHours = (hours: number) => {
        chrome.storage.local.set({ workingHoursPerDay: hours }, () => {
            setWorkingHours(hours)
        })
    }

    return { workingHours, updateWorkingHours, isLoading }
}
