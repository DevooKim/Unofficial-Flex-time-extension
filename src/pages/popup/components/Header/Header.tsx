import { FloatingArrow, FloatingPortal } from '@floating-ui/react'
import { CircularProgress, Snackbar } from '@mui/material'
import dayjs from 'dayjs'
import { useState } from 'react'

import IconButton from '@src/components/IconButton'
import { useOpenFlex } from '@src/hooks'
import useMyFloating from '@src/hooks/useMyFloating'
import DownloadIcon from '@src/icons/DownloadIcon'
import OpenInBrowser from '@src/icons/OpenInBrowser'
import SettingsIcon from '@src/icons/SettingsIcon'
import { isLatestVersion } from '@src/utils/checkVersion'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'

import { useBaseTimeContext } from '@popup/contexts/BaseTimeContext'
import { useWorkingHoursContext } from '@popup/contexts/WorkingHoursContext'
import { useFetchClockData } from '@popup/hooks/queries/useFetchClockData'
import { useFetchCurrentWorkRule } from '@popup/hooks/queries/useFetchCurrentWorkRule'
import { useFetchScheduleData } from '@popup/hooks/queries/useFetchScheduleData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'
import { useFetchWorkRuleInfo } from '@popup/hooks/queries/useFetchWorkRuleInfo'

import { useFetchLatestVersion } from '../../hooks/queries/useFetchLatestVersion'
import WorkingHoursSettingsModal from '../WorkingHoursSettingsModal'

const Header = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { workingHours } = useWorkingHoursContext()
    const { openFlex } = useOpenFlex()
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState('')
    const [isCheckingUpdate, setIsCheckingUpdate] = useState(false)

    const { refetch, isFetching } = useFetchLatestVersion()

    const handleCheckUpdate = async () => {
        setIsCheckingUpdate(true)
        try {
            const result = await refetch()

            if (result.isError) {
                setSnackbarMessage('업데이트 확인에 실패했습니다')
            } else if (result.data) {
                const needsUpdate = !isLatestVersion(APP_VERSION, result.data)
                if (needsUpdate) {
                    setSnackbarMessage(
                        `새 버전이 있습니다! ${APP_VERSION} → ${result.data}`
                    )
                } else {
                    setSnackbarMessage(
                        `최신 버전을 사용 중입니다 (${APP_VERSION})`
                    )
                }
            }
        } catch (error) {
            setSnackbarMessage('업데이트 확인에 실패했습니다')
        } finally {
            setIsCheckingUpdate(false)
        }
    }

    const {
        floating: dateFloating,
        getFloatingInteraction: getDateFloatingInteraction,
        arrowRef: dateFloatingArrowRef,
        isOpen: isDateFloatingOpen,
    } = useMyFloating({})

    const dateFloatingInteraction = getDateFloatingInteraction()

    const {
        floating: settingsFloating,
        getFloatingInteraction: getSettingsFloatingInteraction,
        arrowRef: settingsFloatingArrowRef,
        isOpen: isSettingsFloatingOpen,
    } = useMyFloating({})

    const settingsFloatingInteraction = getSettingsFloatingInteraction()

    const {
        floating: flexFloating,
        getFloatingInteraction: getFlexFloatingInteraction,
        arrowRef: flexFloatingArrowRef,
        isOpen: isFlexFloatingOpen,
    } = useMyFloating({})

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

    const { data: currentWorkRule } = useFetchCurrentWorkRule(userIdHash)

    const { data: workRuleInfo } = useFetchWorkRuleInfo(
        currentWorkRule?.workRule?.customerIdHash || '',
        currentWorkRule?.workRule?.customerWorkRuleId || ''
    )

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

    const primaryWorkRule = workRuleInfo?.workRules?.find(
        (rule) => rule.primary
    )
    const ruleName = primaryWorkRule?.ruleName || ''
    const baseAgreedDayWorkingMinutes =
        primaryWorkRule?.baseAgreedDayWorkingMinutes || 0
    const baseAgreedDayWorkingHours = baseAgreedDayWorkingMinutes / 60
    const dateFrom = currentWorkRule?.workRule?.dateFrom || ''

    return (
        <div>
            <div className="flex flex-col gap-2">
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
                        <div
                            ref={settingsFloating.refs.setReference}
                            className="flex"
                            {...settingsFloatingInteraction.getReferenceProps()}
                        >
                            <IconButton
                                icon={
                                    <SettingsIcon className="h-6 w-6 fill-link" />
                                }
                                onClick={() => setIsSettingsOpen(true)}
                            />
                        </div>
                        <div
                            ref={flexFloating.refs.setReference}
                            className="flex"
                            {...flexFloatingInteraction.getReferenceProps()}
                        >
                            <IconButton
                                icon={
                                    <OpenInBrowser className="h-6 w-6 fill-link" />
                                }
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
                                    isCheckingUpdate || isFetching ? (
                                        <CircularProgress
                                            size={24}
                                            className="text-link"
                                        />
                                    ) : (
                                        <DownloadIcon className="h-6 w-6 fill-link" />
                                    )
                                }
                                onClick={handleCheckUpdate}
                                disabled={isCheckingUpdate || isFetching}
                            />
                        </div>
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
                    {isSettingsFloatingOpen && (
                        <div
                            ref={settingsFloating.refs.setFloating}
                            className="tooltip"
                            style={settingsFloating.floatingStyles}
                            {...settingsFloatingInteraction.getFloatingProps()}
                        >
                            <FloatingArrow
                                ref={settingsFloatingArrowRef}
                                context={settingsFloating.context}
                            />
                            설정
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
                {ruleName && (
                    <div className="text-paragraph-xs flex items-center gap-2 text-alternative">
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">근무규칙:</span>
                            <span>{ruleName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">
                                일일 근무시간:
                            </span>
                            <span>{baseAgreedDayWorkingHours}시간</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="font-semibold">적용일:</span>
                            <span>
                                {dayjs(dateFrom).format('YYYY년 MM월 DD일')}
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <WorkingHoursSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
            <Snackbar
                open={!!snackbarMessage}
                autoHideDuration={3000}
                onClose={() => setSnackbarMessage('')}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            />
        </div>
    )
}

export default Header
