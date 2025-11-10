import { createContext, useContext } from 'react'

import LoadingUI from '@popup/components/LoadingUI'
import { useFetchCurrentWorkRule } from '@popup/hooks/queries/useFetchCurrentWorkRule'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'
import { useFetchWorkRuleInfo } from '@popup/hooks/queries/useFetchWorkRuleInfo'

import { useWorkingHoursSettings } from '../hooks/useWorkingHoursSettings'

type WorkingHoursProviderProps = {
    children: JSX.Element
}

type WorkingHoursContextType = {
    workingHours: number
    updateWorkingHours: (hours: number) => void
    resetWorkingHours: () => void
}

const WorkingHoursContext = createContext<WorkingHoursContextType>(
    {} as WorkingHoursContextType
)

export const useWorkingHoursContext = (): WorkingHoursContextType =>
    useContext(WorkingHoursContext)

const WorkingHoursProvider = ({ children }: WorkingHoursProviderProps) => {
    const { data: userIdHash } = useFetchUserIdHash()
    const { data: currentWorkRule } = useFetchCurrentWorkRule(userIdHash)
    const { data: workRuleInfo } = useFetchWorkRuleInfo(
        currentWorkRule?.workRule?.customerIdHash || '',
        currentWorkRule?.workRule?.customerWorkRuleId || ''
    )

    const primaryWorkRule = workRuleInfo?.workRules?.find(
        (rule) => rule.primary
    )
    const baseAgreedDayWorkingMinutes =
        primaryWorkRule?.baseAgreedDayWorkingMinutes

    const { workingHours, updateWorkingHours, resetWorkingHours, isLoading } =
        useWorkingHoursSettings(baseAgreedDayWorkingMinutes)

    if (isLoading) return <LoadingUI />

    return (
        <WorkingHoursContext.Provider
            value={{
                workingHours,
                updateWorkingHours,
                resetWorkingHours,
            }}
        >
            {children}
        </WorkingHoursContext.Provider>
    )
}

export default WorkingHoursProvider
