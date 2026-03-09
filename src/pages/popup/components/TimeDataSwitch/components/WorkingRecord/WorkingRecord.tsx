import { FloatingArrow, FloatingPortal } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'

import ButtonToggleGroup from '@src/components/ButtonToggleGroup'
import IconButton from '@src/components/IconButton'
import {
    useFetchClockData,
    useFetchScheduleData,
    useGetTargetDate,
    useMyFloating,
} from '@src/hooks'
import { HelpCircleIcon, TransferIcon } from '@src/icons'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { useWorkingHoursContext } from '@src/pages/popup/contexts/WorkingHoursContext'
import { useFetchUserIdHash } from '@src/pages/popup/hooks'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'
import { hourToString } from '@src/utils/utils.time'

interface ProgressBarProps {
    근무시간총합: number
    최소근무시간: number
    남은근무시간: number
    휴가시간: number
}
const ProgressBar = ({
    근무시간총합,
    최소근무시간,
    남은근무시간,
    휴가시간 = 0,
}: ProgressBarProps) => {
    const [viewWorkedTime, setViewWorkedTime] = useState(true)
    const viewWorkedTimeToggle = () => setViewWorkedTime((prev) => !prev)

    useEffect(() => {
        Browser.runtime.onMessage.addListener((message) => {
            if (message.type === 'toggle_time') {
                viewWorkedTimeToggle()
            }
        })
    }, [])

    const 초과근무시간 = Math.max(근무시간총합 - 최소근무시간, 0)

    const workTimeBarWidth = `${Math.max(Math.min(((근무시간총합 - 초과근무시간) / 최소근무시간) * 100, 100), 3).toFixed(2)}%`
    const vacationTimeBarWidth = `${Math.max(Math.min((휴가시간 / 최소근무시간) * 100, 100), 0).toFixed(2)}%`
    const overtimeBarWidth = `${((초과근무시간 / 최소근무시간) * 100).toFixed(2)}%`
    const remainingTimeBarWidth = `${Math.max(Math.min((남은근무시간 / 최소근무시간) * 100, 100), 0).toFixed(2)}%`
    const remainingTimeText =
        남은근무시간 >= 0
            ? `${hourToString(남은근무시간)} 남음`
            : '시간을 다 채웠어요'

    const viewModeTooltip = useMyFloating({
        placement: 'top',
        delay: { open: 250 },
    })
    const vacationTimeTooltip = useMyFloating({
        delay: { open: 250 },
    })
    const workTimeTooltip = useMyFloating({
        delay: { open: 250 },
    })
    const overtimeTooltip = useMyFloating({
        delay: { open: 250 },
    })
    const remainingTimeTooltip = useMyFloating({
        delay: { open: 250 },
    })

    const floatingElements = [
        {
            isOpen: viewModeTooltip.isOpen,
            floating: viewModeTooltip,
            content: viewWorkedTime
                ? '남은 시간으로 보기'
                : '채운 시간으로 보기',
        },
        {
            isOpen: workTimeTooltip.isOpen,
            floating: workTimeTooltip,
            content: `근무: ${hourToString(근무시간총합 - 초과근무시간)}`,
        },
        {
            isOpen: overtimeTooltip.isOpen,
            floating: overtimeTooltip,
            content: `초과: ${hourToString(초과근무시간)}`,
        },
        {
            isOpen: remainingTimeTooltip.isOpen,
            floating: remainingTimeTooltip,
            content: `남은: ${hourToString(남은근무시간)}`,
        },
        {
            isOpen: vacationTimeTooltip.isOpen,
            floating: vacationTimeTooltip,
            content: `연차: ${hourToString(휴가시간)}`,
        },
    ]
    return (
        <>
            <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center">
                    <h4 className="text-xl font-bold">
                        {viewWorkedTime
                            ? hourToString(근무시간총합)
                            : remainingTimeText}
                    </h4>

                    <div ref={viewModeTooltip.floating.refs.setReference}>
                        <IconButton
                            className="ml-1 h-6 w-6 rounded-lg bg-gray-100"
                            icon={<TransferIcon />}
                            onClick={viewWorkedTimeToggle}
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
                        ref={vacationTimeTooltip.floating.refs.setReference}
                    />
                ) : null}
                <div
                    className="h-2 bg-blue-500"
                    style={{ width: workTimeBarWidth || 0 }}
                    ref={workTimeTooltip.floating.refs.setReference}
                />
                {초과근무시간 ? (
                    <div
                        className="h-2 bg-red-400"
                        style={{ width: overtimeBarWidth }}
                        ref={overtimeTooltip.floating.refs.setReference}
                    />
                ) : null}
                {남은근무시간 ? (
                    <div
                        className="h-2 bg-gray-200"
                        style={{ width: remainingTimeBarWidth }}
                        ref={remainingTimeTooltip.floating.refs.setReference}
                    />
                ) : null}
            </div>
            <FloatingPortal>
                {floatingElements.map(
                    ({ isOpen, floating, content }, i) =>
                        isOpen && (
                            <div
                                key={i}
                                ref={floating.floating.refs.setFloating}
                                className="tooltip z-10"
                                style={floating.floating.floatingStyles}
                            >
                                <FloatingArrow
                                    ref={floating.arrowRef}
                                    context={floating.floating.context}
                                />
                                {content}
                            </div>
                        )
                )}
            </FloatingPortal>
        </>
    )
}

interface TimeCardProps {
    icon: string
    title: string
    text: string
    titleAction?: ReactNode
}
const TimeCard = ({ icon, title, text, titleAction }: TimeCardProps) => (
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
            <div className="flex items-center gap-2">
                <p className="text-hint">{title}</p>
                {titleAction}
            </div>
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
        <TimeCard icon="📊" title="현재 부족한 시간은?" text={'0시간 0분'} />
        <TimeCard
            icon="👍"
            title="오늘 권장 근무 시간은?"
            text={'0시간 0분 정도 일하면 좋아요.'}
        />
    </div>
)

const WorkingRecord = () => {
    const [isIncludingCurrentWork, setIsIncludingCurrentWork] = useState(false)
    const { data: userIdHash } = useFetchUserIdHash()
    const { targetTimeStamp } = useGetTargetDate()
    const { baseTimeData } = useBaseTimeContext()
    const { workingHours } = useWorkingHoursContext()
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
        arrowRef,
        isOpen: isFloatingOpen,
    } = useMyFloating({
        placement: 'top',
        delay: { open: 250 },
    })

    const {
        floating: toggleFloating,
        arrowRef: toggleArrowRef,
        isOpen: isToggleFloatingOpen,
    } = useMyFloating({
        placement: 'top',
        delay: { open: 250 },
    })

    if (scheduleLoading || clockLoading) return <Skeleton />

    const myClockData = parseClockData({ data: clockData, now })

    const {
        근무시간총합,
        최소근무시간,
        남은평균근무시간,
        남은근무시간,
        휴가정보list,
        부족시간차이,
    } = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
        workingHoursPerDay: workingHours,
    })

    const 현재부족시간차이 = isIncludingCurrentWork
        ? 부족시간차이.포함
        : 부족시간차이.미포함

    return (
        <div>
            <div className="p-4">
                <div className="mb-2 flex text-xs text-hint">
                    이번 달 최소 근무 시간
                    <div ref={floating.refs.setReference}>
                        <HelpCircleIcon className="ml-1" />
                    </div>
                </div>
                <ProgressBar
                    근무시간총합={근무시간총합}
                    최소근무시간={최소근무시간}
                    남은근무시간={남은근무시간}
                    휴가시간={휴가정보list.reduce(
                        (acc, cur) => acc + (cur.totalHours || 0),
                        0
                    )}
                />
            </div>
            <TimeCard
                icon="📊"
                title="현재 부족한 시간은?"
                titleAction={
                    <div ref={toggleFloating.refs.setReference}>
                        <ButtonToggleGroup
                            defaultIndex={isIncludingCurrentWork ? 1 : 0}
                        >
                            <ButtonToggleGroup.Item
                                className="px-2 py-0.5 text-[10px]"
                                onClick={() => setIsIncludingCurrentWork(false)}
                            >
                                미포함
                            </ButtonToggleGroup.Item>
                            <ButtonToggleGroup.Item
                                className="px-2 py-0.5 text-[10px]"
                                onClick={() => setIsIncludingCurrentWork(true)}
                            >
                                포함
                            </ButtonToggleGroup.Item>
                        </ButtonToggleGroup>
                    </div>
                }
                text={
                    현재부족시간차이 >= 0
                        ? `${hourToString(현재부족시간차이)} 여유`
                        : `${hourToString(Math.abs(현재부족시간차이))} 부족`
                }
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
                    >
                        <FloatingArrow
                            ref={arrowRef}
                            context={floating.context}
                        />
                        오늘 근무 시간이 포함된 정보예요.
                    </div>
                )}
                {isToggleFloatingOpen && (
                    <div
                        ref={toggleFloating.refs.setFloating}
                        className="tooltip z-10"
                        style={toggleFloating.floatingStyles}
                    >
                        <FloatingArrow
                            ref={toggleArrowRef}
                            context={toggleFloating.context}
                        />
                        오늘 진행 중인 근무 시간의 포함 여부를 선택해요.
                    </div>
                )}
            </FloatingPortal>
        </div>
    )
}

export default WorkingRecord
