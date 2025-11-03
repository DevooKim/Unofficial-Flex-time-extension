import { createContext, useContext } from 'react'

import LoadingUI from '@popup/components/LoadingUI'

import { useWorkingHoursSettings } from '../hooks/useWorkingHoursSettings'

type WorkingHoursProviderProps = {
    children: JSX.Element
}

type WorkingHoursContextType = {
    workingHours: number
    updateWorkingHours: (hours: number) => void
}

const WorkingHoursContext = createContext<WorkingHoursContextType>(
    {} as WorkingHoursContextType
)

export const useWorkingHoursContext = (): WorkingHoursContextType =>
    useContext(WorkingHoursContext)

const WorkingHoursProvider = ({ children }: WorkingHoursProviderProps) => {
    const { workingHours, updateWorkingHours, isLoading } =
        useWorkingHoursSettings()

    if (isLoading) return <LoadingUI />

    return (
        <WorkingHoursContext.Provider
            value={{
                workingHours,
                updateWorkingHours,
            }}
        >
            {children}
        </WorkingHoursContext.Provider>
    )
}

export default WorkingHoursProvider
