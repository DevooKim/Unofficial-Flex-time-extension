import {
    useFetchClockData,
    useFetchScheduleData,
    useGetTargetDate,
} from '@src/hooks'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { useFetchUserIdHash } from '@src/pages/popup/hooks'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'
import { hourToString } from '@src/utils/utils.time'

// TODO: *refactor* 필요한 데이터만 가져오기, 컴포넌트 분리
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

    if (scheduleLoading || clockLoading) return

    const myClockData = parseClockData({ data: clockData, now })

    const { 근무시간총합, 최소근무시간 } = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
    })

    const progressBarWidth = `${Math.max(Math.min((근무시간총합 / 최소근무시간) * 100, 100), 3).toFixed(2)}%`

    return (
        <div className="mt-4">
            <p className="mb-2 text-xs text-hint">
                이번 달 최소 근무 시간 <span className="ml-1">?*icon*</span>
            </p>
            <div className="mb-1 flex items-center justify-between">
                <h4 className="text-xl font-bold">
                    {hourToString(근무시간총합)}
                </h4>
                <p className="m-0 mb-2 text-xs text-hint">{최소근무시간}시간</p>
            </div>
            <div className="h-2 w-full rounded bg-gray-200">
                <div
                    className="h-2 rounded bg-blue-500"
                    style={{ width: progressBarWidth || 0 }}
                />
            </div>
        </div>
    )
}

export default WorkingRecord
