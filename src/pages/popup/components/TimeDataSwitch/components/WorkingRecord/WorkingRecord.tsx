import { FloatingArrow, FloatingPortal } from '@floating-ui/react'
import { useState } from 'react'

import IconButton from '@src/components/IconButton'
import {
    useFetchClockData,
    useFetchScheduleData,
    useGetTargetDate,
    useMyFloating,
} from '@src/hooks'
import { HelpCircleIcon, TransferIcon } from '@src/icons'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { useFetchUserIdHash } from '@src/pages/popup/hooks'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'
import { hourToString } from '@src/utils/utils.time'

const ProgressBar = ({
    근무시간총합,
    최소근무시간,
    남은근무시간,
    휴가시간 = 0,
}: {
    근무시간총합: number
    최소근무시간: number
    남은근무시간: number
    휴가시간: number
}) => {
    const [viewWorkedTime, setViewWorkedTime] = useState(true)

    const {
        floating: viewModeFloating,
        floatingInteraction: viewModeFloatingInteraction,
        arrowRef: viewModeFloatingArrowRef,
        isOpen: isViewModeFloatingOpen,
    } = useMyFloating({ placement: 'top' })
    const {
        floating: vacationTimeFloating,
        floatingInteraction: vacationTimeFloatingInteraction,
        arrowRef: vacationTimeFloatingArrowRef,
        isOpen: isVacationTimeFloatingOpen,
    } = useMyFloating({})
    const {
        floating: workTimeFloating,
        floatingInteraction: workTimeFloatingInteraction,
        arrowRef: workTimeFloatingArrowRef,
        isOpen: isWorkTimeFloatingOpen,
    } = useMyFloating({})
    const {
        floating: overtimeFloating,
        floatingInteraction: overtimeFloatingInteraction,
        arrowRef: overtimeFloatingArrowRef,
        isOpen: isOvertimeFloatingOpen,
    } = useMyFloating({})

    const {
        floating: remainingTimeFloating,
        floatingInteraction: remainingTimeFloatingInteraction,
        arrowRef: remainingTimeFloatingArrowRef,
        isOpen: isRemainingTimeFloatingOpen,
    } = useMyFloating({})

    const 초과근무시간 = Math.max(근무시간총합 - 최소근무시간, 0)

    const workTimeBarWidth = `${Math.max(Math.min(((근무시간총합 - 초과근무시간) / 최소근무시간) * 100, 100), 3).toFixed(2)}%`
    const vacationTimeBarWidth = `${Math.max(Math.min((휴가시간 / 최소근무시간) * 100, 100), 0).toFixed(2)}%`
    const overtimeBarWidth = `${((초과근무시간 / 최소근무시간) * 100).toFixed(2)}%`
    const remainingTimeBarWidth = `${Math.max(Math.min((남은근무시간 / 최소근무시간) * 100, 100), 0).toFixed(2)}%`
    const remainingTimeText =
        남은근무시간 >= 0
            ? `${hourToString(남은근무시간)} 남음`
            : '시간을 다 채웠어요'
    return (
        <>
            <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center">
                    <h4 className="text-xl font-bold">
                        {viewWorkedTime
                            ? hourToString(근무시간총합)
                            : remainingTimeText}
                    </h4>

                    <div
                        ref={viewModeFloating.refs.setReference}
                        {...viewModeFloatingInteraction.getReferenceProps()}
                    >
                        <IconButton
                            className="ml-1 h-6 w-6 rounded-lg bg-gray-100"
                            icon={<TransferIcon />}
                            onClick={() => setViewWorkedTime((prev) => !prev)}
                        />
                    </div>
                </div>
                <p className="m-0 mb-2 text-xs text-hint">{최소근무시간}시간</p>
            </div>
            <div className="flex h-2 w-full rounded bg-gray-200 [&>:first-child]:rounded-l [&>:last-child]:rounded-r-md">
                {휴가시간 ? (
                    <div
                        className="h-2 bg-blue-200"
                        style={{ width: vacationTimeBarWidth }}
                        ref={vacationTimeFloating.refs.setReference}
                        {...vacationTimeFloatingInteraction.getReferenceProps()}
                    />
                ) : null}
                <div
                    className="h-2 bg-blue-500"
                    style={{ width: workTimeBarWidth || 0 }}
                    ref={workTimeFloating.refs.setReference}
                    {...workTimeFloatingInteraction.getReferenceProps()}
                />
                {초과근무시간 ? (
                    <div
                        className="h-2 bg-red-400"
                        style={{ width: overtimeBarWidth }}
                        ref={overtimeFloating.refs.setReference}
                        {...overtimeFloatingInteraction.getReferenceProps()}
                    />
                ) : null}
                {남은근무시간 ? (
                    <div
                        className="h-2 bg-gray-200"
                        style={{ width: remainingTimeBarWidth }}
                        ref={remainingTimeFloating.refs.setReference}
                        {...remainingTimeFloatingInteraction.getReferenceProps()}
                    />
                ) : null}
            </div>
            <FloatingPortal>
                {isViewModeFloatingOpen && (
                    <div
                        ref={viewModeFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={viewModeFloating.floatingStyles}
                        {...viewModeFloatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={viewModeFloatingArrowRef}
                            context={viewModeFloating.context}
                        />
                        {viewWorkedTime
                            ? '남은 시간으로 보기'
                            : '채운 시간으로 보기'}
                    </div>
                )}
                {isVacationTimeFloatingOpen && (
                    <div
                        ref={vacationTimeFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={vacationTimeFloating.floatingStyles}
                        {...vacationTimeFloatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={vacationTimeFloatingArrowRef}
                            context={vacationTimeFloating.context}
                        />
                        연차: {hourToString(휴가시간)}
                    </div>
                )}
                {isWorkTimeFloatingOpen && (
                    <div
                        ref={workTimeFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={workTimeFloating.floatingStyles}
                        {...workTimeFloatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={workTimeFloatingArrowRef}
                            context={workTimeFloating.context}
                        />
                        근무: {hourToString(근무시간총합 - 초과근무시간)}
                    </div>
                )}
                {isOvertimeFloatingOpen && (
                    <div
                        ref={overtimeFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={overtimeFloating.floatingStyles}
                        {...overtimeFloatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={overtimeFloatingArrowRef}
                            context={overtimeFloating.context}
                        />
                        초과: {hourToString(초과근무시간)}
                    </div>
                )}
                {isRemainingTimeFloatingOpen && (
                    <div
                        ref={remainingTimeFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={remainingTimeFloating.floatingStyles}
                        {...remainingTimeFloatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={remainingTimeFloatingArrowRef}
                            context={remainingTimeFloating.context}
                        />
                        남은: {hourToString(남은근무시간)}
                    </div>
                )}
            </FloatingPortal>
        </>
    )
}
const TimeCard = ({
    icon,
    title,
    text,
}: {
    icon: string
    title: string
    text: string
}) => (
    <div className="flex items-center gap-5 px-4 py-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100 ">
            <h3
                className="text-2xl/9 font-bold"
                style={{
                    textShadow: '-1px 2px 2px rgba(173, 173, 180, 1)',
                }}
            >
                {icon}
            </h3>
        </div>
        <div className="flex flex-col">
            <p className="text-hint">{title}</p>
            <h4 className="text-xl">{text}</h4>
        </div>
    </div>
)

const Skeleton = () => (
    <div>
        <div className="p-4">
            <div className="mb-2 flex text-xs text-hint">
                이번 달 최소 근무 시간
                <HelpCircleIcon className="ml-1" />
            </div>
            <ProgressBar
                근무시간총합={0}
                최소근무시간={0}
                남은근무시간={0}
                휴가시간={0}
            />
        </div>
        <TimeCard
            icon="⌛"
            title="지금 퇴근하면?"
            text={'0시간 0분 남았어요.'}
        />
        <TimeCard
            icon="👍"
            title="오늘 권장 근무 시간은?"
            text={'0시간 0분 정도 일하면 좋아요.'}
        />
    </div>
)

const WorkingRecord = () => {
    const { data: userIdHash } = useFetchUserIdHash()
    const { targetTimeStamp } = useGetTargetDate()
    const { baseTimeData } = useBaseTimeContext()
    const { firstDay, lastDay, now } = baseTimeData
    const { loading: scheduleLoading, data: scheduleData } =
        useFetchScheduleData({ userIdHash, timeStamp: targetTimeStamp })

    const { loading: clockLoading, data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: firstDay,
        timeStampTo: lastDay,
    })

    const {
        floating,
        floatingInteraction,
        arrowRef,
        isOpen: isFloatingOpen,
    } = useMyFloating({
        placement: 'top',
    })

    if (scheduleLoading || clockLoading) return <Skeleton />

    const myClockData = parseClockData({ data: clockData, now })

    const {
        근무시간총합,
        최소근무시간,
        지금기준,
        남은평균근무시간,
        남은근무시간,
        휴가정보list,
    } = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
    })

    return (
        <div>
            <div className="p-4">
                <div className="mb-2 flex text-xs text-hint">
                    이번 달 최소 근무 시간
                    <div
                        ref={floating.refs.setReference}
                        {...floatingInteraction.getReferenceProps()}
                    >
                        <HelpCircleIcon className="ml-1" />
                    </div>
                </div>
                <ProgressBar
                    근무시간총합={근무시간총합}
                    최소근무시간={최소근무시간}
                    남은근무시간={남은근무시간}
                    휴가시간={휴가정보list[0]?.totalHours || 0}
                />
            </div>
            <TimeCard
                icon="⌛"
                title="지금 퇴근하면?"
                text={`${hourToString(지금기준.남은근무시간)} 남았어요.`}
            />
            <TimeCard
                icon="👍"
                title="오늘 권장 근무 시간은?"
                text={`${hourToString(남은평균근무시간)} 정도 일하면 좋아요.`}
            />
            <FloatingPortal>
                {isFloatingOpen && (
                    <div
                        ref={floating.refs.setFloating}
                        className="tooltip z-10"
                        style={floating.floatingStyles}
                        {...floatingInteraction.getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={arrowRef}
                            context={floating.context}
                        />
                        오늘을 제외한 근무 정보예요.
                    </div>
                )}
            </FloatingPortal>
        </div>
    )
}

export default WorkingRecord
