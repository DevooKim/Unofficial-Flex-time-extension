import Badge from '@src/components/Badge'
import { myClockData } from '@src/types'
import { parseClockData } from '@src/utils/parseClockData'
import { formatAmPm, hourToString } from '@src/utils/utils.time'

import { useBaseTimeContext } from '@popup/contexts/BaseTimeContext'
import { useFetchClockData } from '@popup/hooks/queries/useFetchClockData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'

type StatusProps = {
    현재근무상태: myClockData['현재근무상태']
    오늘일한시간: string
}

const boxColorVariant = {
    근무중: 'bg-primary/[.08]',
    출근전: 'bg-gray-50',
    퇴근: 'bg-warning/[.08]',
}

const statusTextColorVariant = {
    근무중: 'text-primary',
    출근전: 'text-link',
    퇴근: 'text-warning',
}

const badgeColorVariant = {
    근무중: 'primary',
    출근전: 'info',
    퇴근: 'warning',
} as const

const StatusInfo = ({ 현재근무상태, 오늘일한시간 }: StatusProps) => (
    <div className={`flex items-start ${statusTextColorVariant[현재근무상태]}`}>
        <div
            className={`flex items-center justify-between gap-2 ${statusTextColorVariant[현재근무상태]}`}
        >
            <div className="text-h4">{현재근무상태}</div>
            <Badge
                className="!rounded-[13px]"
                color={badgeColorVariant[현재근무상태]}
                size="md"
            >
                <div className="text-subtitle-2"> {오늘일한시간}</div>
            </Badge>
        </div>
    </div>
)

const WorkingStatus = () => {
    const { baseTimeData } = useBaseTimeContext()

    const { data: userIdHash } = useFetchUserIdHash()

    const { data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: baseTimeData.firstDay,
        timestampTo: baseTimeData.lastDay,
        isCached: baseTimeData.isCached,
    })

    const {
        현재근무상태,
        출근시간: _출근시간,
        퇴근시간: _퇴근시간,
        오늘일한시간: _오늘일한시간,
    } = parseClockData({
        data: clockData,
        now: baseTimeData.now,
    })

    const 출근시간 = formatAmPm(_출근시간)
    const 퇴근시간 = formatAmPm(_퇴근시간)
    const 오늘일한시간 = hourToString(_오늘일한시간)

    return (
        <div
            className={`flex flex-col gap-3 rounded-lg p-5 ${boxColorVariant[현재근무상태]}`}
        >
            <StatusInfo
                현재근무상태={현재근무상태}
                오늘일한시간={오늘일한시간}
            />
            {현재근무상태 === '출근전' && (
                <div className="text-h6 text-info">
                    출근했다면 flex에서 근무 시작을 눌러 주세요!
                </div>
            )}
            {현재근무상태 === '퇴근' && (
                <div className="text-h6">
                    {출근시간} ~ {퇴근시간}
                </div>
            )}
            {현재근무상태 === '근무중' && (
                <div className="text-h6">{출근시간} ~ </div>
            )}
        </div>
    )
}

export default WorkingStatus
