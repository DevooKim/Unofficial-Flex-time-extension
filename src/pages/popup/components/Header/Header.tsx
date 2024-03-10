import dayjs from 'dayjs'

import IconButton from '@src/components/IconButton'
import { useOpenFlex } from '@src/hooks'
import GlobalIcon from '@src/icons/GlobalIcon'
import { parseClockData } from '@src/utils/parseClockData'
import { parseScheduleData } from '@src/utils/parseScheduleData'

import { useBaseTimeContext } from '@popup/contexts/BaseTimeContext'
import { useFetchScheduleData } from '@popup/hooks/queries/useFetchScheduleData'
import { useFetchUserIdHash } from '@popup/hooks/queries/useFetchUserIdHash'

import { useFetchClockData } from '../../hooks/queries/useFetchClockData'

const Header = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { openFlex } = useOpenFlex()

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
    })

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
                <div className="text-h6 text-alternative">
                    {dayjs(baseTimeData.today).format('MM월 DD일')}
                </div>
                <div className="text-paragraph-sm text-link">
                    (
                    {myClockData.현재근무상태 === '근무중'
                        ? myScheduleData.지금기준.남은근무일
                        : myScheduleData.남은근무일}{' '}
                    / {myScheduleData.워킹데이})
                </div>
            </div>
            <IconButton
                icon={<GlobalIcon className="w-6 h-6 fill-link" />}
                onClick={openFlex}
            />
        </div>
    )
}

export default Header
