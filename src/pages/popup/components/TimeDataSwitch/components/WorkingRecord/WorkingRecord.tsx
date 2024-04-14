import { useState } from 'react'

import IconButton from '@src/components/IconButton'
import {
    useFetchClockData,
    useFetchScheduleData,
    useGetTargetDate,
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
}: {
    근무시간총합: number
    최소근무시간: number
    남은근무시간: number
}) => {
    const [viewWorkedTime, setViewWorkedTime] = useState(true)

    const progressBarWidth = `${Math.max(Math.min((근무시간총합 / 최소근무시간) * 100, 100), 3).toFixed(2)}%`

    return (
        <>
            <div className="mb-1 flex items-center justify-between">
                <h4 className="text-xl font-bold">
                    {viewWorkedTime
                        ? hourToString(근무시간총합)
                        : `${hourToString(남은근무시간)} 남음`}

                    <IconButton
                        className="ml-1 h-6 w-6 rounded-lg bg-gray-100"
                        icon={<TransferIcon />}
                        onClick={() => setViewWorkedTime((prev) => !prev)}
                    />
                </h4>
                <p className="m-0 mb-2 text-xs text-hint">{최소근무시간}시간</p>
            </div>
            <div className="h-2 w-full rounded bg-gray-200">
                <div
                    className="h-2 rounded bg-blue-500"
                    style={{ width: progressBarWidth || 0 }}
                />
            </div>
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
            <ProgressBar 근무시간총합={0} 최소근무시간={0} 남은근무시간={0} />
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

    if (scheduleLoading || clockLoading) return <Skeleton />

    const myClockData = parseClockData({ data: clockData, now })

    const {
        근무시간총합,
        최소근무시간,
        지금기준,
        남은평균근무시간,
        남은근무시간,
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
                    <HelpCircleIcon className="ml-1" />
                </div>
                <ProgressBar
                    근무시간총합={근무시간총합}
                    최소근무시간={최소근무시간}
                    남은근무시간={남은근무시간}
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
        </div>
    )
}

export default WorkingRecord
