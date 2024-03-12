import VocationIcon from '@src/icons/VocationIcon'
import { useBaseTimeContext } from '@src/pages/popup/contexts/BaseTimeContext'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'

import { useFetchClockData } from '@popup/hooks/queries/useFetchClockData'
import { useFetchScheduleData } from '@popup/hooks/queries/useFetchScheduleData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'

const TimeOff = () => {
    // NOTE: Flex API를 요청하기 위한 기본 시간 데이터가 담겨 있음
    const { baseTimeData } = useBaseTimeContext()

    // NOTE: Flex API를 요청하기 위한 유저 아이디 해시가 담겨 있음
    const { data: userIdHash } = useFetchUserIdHash()

    // NOTE: 나의 근무상태 데이터를 가져옴
    const { data: clockData } = useFetchClockData({
        userIdHash,
        timeStampFrom: baseTimeData.firstDay,
        timestampTo: baseTimeData.lastDay,
        isCached: baseTimeData.isCached,
    })
    // NOTE: 나의 근무상태 데이터를 파싱하여 사용하기 쉽게 만듬
    const myClockData = parseClockData({
        data: clockData,
        now: baseTimeData.today,
    })

    // NOTE: 나의 스케줄 데이터를 가져옴
    const { data: scheduleData } = useFetchScheduleData({
        userIdHash,
        timeStamp: baseTimeData.today,
        isCached: baseTimeData.isCached,
    })
    // NOTE: 나의 스케줄 데이터를 파싱하여 사용하기 쉽게 만듬
    const myScheduleData = parseScheduleData({
        data: scheduleData,
        today: baseTimeData.today,
        clockData: myClockData,
    })
    const 이번달휴가일수 = myScheduleData.휴가정보list.reduce(
        (acc, cur) => acc + (cur.totalHours + cur.totalMinutes) / 8,
        0
    )

    return (
        <section className="mt-2">
            <TimeOffHeader 이번달휴가일수={이번달휴가일수} />
        </section>
    )
}

interface TimeOffHeaderProps {
    이번달휴가일수: number
}
const TimeOffHeader = (props: TimeOffHeaderProps) => {
    const { 이번달휴가일수 } = props
    return (
        <header className="flex px-3 py-2 gap-x-5">
            <VocationIcon className="" />
            <div className="flex flex-col gap-y-1">
                <span className="text-xs text-hint">이번 달 휴가 일수</span>
                <span className="text-lg text-alternative">
                    {이번달휴가일수 === 0
                        ? '사용한 연차가 없어요.'
                        : `${이번달휴가일수}일 쉬어요.`}
                </span>
            </div>
        </header>
    )
}

export default TimeOff
