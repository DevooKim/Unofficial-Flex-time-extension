import { FloatingArrow, FloatingPortal } from '@floating-ui/react'
import dayjs from 'dayjs'
import { useState } from 'react'

import IconButton from '@src/components/IconButton'
import { useOpenFlex } from '@src/hooks'
import useMyFloating from '@src/hooks/useMyFloating'
import GlobalIcon from '@src/icons/GlobalIcon'
import SettingsIcon from '@src/icons/SettingsIcon'
import StarFillIcon from '@src/icons/StarFillIcon'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'

import { useBaseTimeContext } from '@popup/contexts/BaseTimeContext'
import { useWorkingHoursContext } from '@popup/contexts/WorkingHoursContext'
import { useFetchClockData } from '@popup/hooks/queries/useFetchClockData'
import { useFetchScheduleData } from '@popup/hooks/queries/useFetchScheduleData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'

import { useFetchLatestVersion } from '../../hooks/queries/useFetchLatestVersion'
import WorkingHoursSettingsModal from '../WorkingHoursSettingsModal'

const Header = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { workingHours } = useWorkingHoursContext()
    const { openFlex } = useOpenFlex()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)

    const { refetch } = useFetchLatestVersion()

    const {
        floating: dateFloating,
        getFloatingInteraction: getDateFloatingInteraction,
        arrowRef: dateFloatingArrowRef,
        isOpen: isDateFloatingOpen,
    } = useMyFloating({})

    const dateFloatingInteraction = getDateFloatingInteraction()

    const {
        floating: flexFloating,
        getFloatingInteraction: getFlexFloatingInteraction,
        arrowRef: flexFloatingArrowRef,
        isOpen: isFlexFloatingOpen,
    } = useMyFloating({
        delay: {
            open: 750,
        },
    })
    const flexFloatingInteraction = getFlexFloatingInteraction()

    const {
        floating: updateFloating,
        getFloatingInteraction: getUpdateFloatingInteraction,
        arrowRef: updateFloatingArrowRef,
        isOpen: isUpdateFloatingOpen,
    } = useMyFloating({
        placement: 'bottom-end',
    })

    const updateFloatingInteraction = getUpdateFloatingInteraction()

    const { data: userIdHash } = useFetchUserIdHash()

    const { data: scheduleData } = useFetchScheduleData({
        userIdHash,
        timeStamp: baseTimeData.today,
        isCached: baseTimeData.isCached,
    })

    const { data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: baseTimeData.firstDay,
        timestampTo: baseTimeData.lastDay,
        isCached: baseTimeData.isCached,
    })

    const myClockData = parseClockData({
        data: clockData,
        now: baseTimeData.today,
    })

    const myScheduleData = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
        workingHoursPerDay: workingHours,
    })

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <div className="text-h6 text-alternative">
                        {dayjs(baseTimeData.today).format('MM월 DD일')}
                    </div>
                    <div
                        ref={dateFloating.refs.setReference}
                        className="text-paragraph-sm text-link"
                        {...dateFloatingInteraction.getReferenceProps()}
                    >
                        (
                        {myClockData.현재근무상태 === '근무중'
                            ? myScheduleData.지금기준.남은근무일
                            : myScheduleData.남은근무일}{' '}
                        / {myScheduleData.워킹데이})
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <IconButton
                        icon={<SettingsIcon className="h-6 w-6 fill-link" />}
                        onClick={() => setIsSettingsOpen(true)}
                    />
                    <div
                        ref={flexFloating.refs.setReference}
                        className="flex"
                        {...flexFloatingInteraction.getReferenceProps()}
                    >
                        <IconButton
                            icon={<GlobalIcon className="h-6 w-6 fill-link" />}
                            onClick={openFlex}
                        />
                    </div>
                    <div
                        ref={updateFloating.refs.setReference}
                        className="flex"
                        {...updateFloatingInteraction.getReferenceProps()}
                    >
                        <IconButton
                            icon={
                                <StarFillIcon className="h-6 w-6 fill-link" />
                            }
                            onClick={() => refetch()}
                        />
                    </div>
                </div>
                <FloatingPortal>
                    {isDateFloatingOpen && (
                        <div
                            ref={dateFloating.refs.setFloating}
                            className="tooltip"
                            style={dateFloating.floatingStyles}
                            {...dateFloatingInteraction.getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={dateFloatingArrowRef}
                                context={dateFloating.context}
                            />
                            남은 근무일
                        </div>
                    )}
                    {isFlexFloatingOpen && (
                        <div
                            ref={flexFloating.refs.setFloating}
                            className="tooltip"
                            style={flexFloating.floatingStyles}
                            {...flexFloatingInteraction.getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={flexFloatingArrowRef}
                                context={flexFloating.context}
                            />
                            flex로 이동
                        </div>
                    )}
                    {isUpdateFloatingOpen && (
                        <div
                            ref={updateFloating.refs.setFloating}
                            className="tooltip"
                            style={updateFloating.floatingStyles}
                            {...updateFloatingInteraction.getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={updateFloatingArrowRef}
                                context={updateFloating.context}
                            />
                            업데이트 확인
                        </div>
                    )}
                </FloatingPortal>
            </div>
            <WorkingHoursSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    )
}

export default Header
