import DotIcon from '@src/icons/DotIcon'
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

const boxStyle = {
    근무중: 'bg-primary/[.08]',
    출근전: 'bg-gray-50',
    퇴근: 'bg-warning/[.08]',
}

const statusTextColor = {
    근무중: 'text-primary',
    출근전: 'text-link',
    퇴근: 'text-warning',
}

const dotIconColor = {
    근무중: 'fill-primary',
    출근전: 'fill-link',
    퇴근: 'fill-warning',
}

const StatusInfo = ({ 현재근무상태, 오늘일한시간 }: StatusProps) => (
    <div className={statusTextColor[현재근무상태]}>
        <DotIcon className={dotIconColor[현재근무상태]} width="6" height="6" />
        {현재근무상태}
        <div>{오늘일한시간}</div>
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
        now: baseTimeData.today,
    })

    const 출근시간 = formatAmPm(_출근시간)
    const 퇴근시간 = formatAmPm(_퇴근시간)
    const 오늘일한시간 = hourToString(_오늘일한시간)

    return (
        <div className={boxStyle[현재근무상태]}>
            <StatusInfo
                현재근무상태={현재근무상태}
                오늘일한시간={오늘일한시간}
            />
            <div>출근시간: {출근시간}</div>
            <div>퇴근시간: {퇴근시간}</div>
            <div>오늘 일한 시간: {오늘일한시간}</div>
        </div>
    )
}

export default WorkingStatus
