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

    return <h1>TimeOff</h1>
}

export default TimeOff
