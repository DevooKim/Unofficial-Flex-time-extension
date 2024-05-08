import dayjs from 'dayjs'

import { flexClockData, myClockData } from '../types'

const 현재근무정보구하기 = ({
    now,
    records,
}: {
    now: number
    records: flexClockData['records']
}) => {
    const currentDate = dayjs(now).format('YYYY-MM-DD')

    const todayRecords = records.find(
        ({ appliedDate }) => appliedDate === currentDate
    )

    return todayRecords?.workClockRecordPacks[0]
}

const 지금까지의휴계시간구하기 = ({
    now,
    restRecords,
}: {
    now: number
    restRecords: flexClockData['records'][0]['workClockRecordPacks'][0]['restRecords']
}) =>
    restRecords.reduce((acc, { restStartRecord, restStopRecord }) => {
        const { targetTime: startTargetTime } = restStartRecord || {}
        const { targetTime: stopTargetTime } = restStopRecord || {}

        if (dayjs(startTargetTime).isSameOrAfter(now)) {
            return acc
        }

        const start = startTargetTime
        const stop = Math.min(stopTargetTime || now, now)

        return acc + dayjs(stop).diff(dayjs(start), 'minute')
    }, 0)

const 오늘일한시간구하기 = ({
    출근시간,
    퇴근시간,
    now,
    휴계시간,
}: {
    출근시간: number | undefined
    퇴근시간: number | undefined
    now: number
    휴계시간: number
}) => {
    const key = 퇴근시간 || now

    return (dayjs(key).diff(dayjs(출근시간), 'minute') - 휴계시간) / 60
}

export const parseClockData = ({
    data,
    now,
}: {
    data: flexClockData
    now: number
}): myClockData => {
    const 현재근무정보 = 현재근무정보구하기({
        now,
        records: data.records,
    })

    if (!현재근무정보) {
        return {
            현재근무상태: '출근전',
            출근시간: 0,
            퇴근시간: 0,
            오늘일한시간: 0,
        }
    }

    const { startRecord, stopRecord, onGoing, restRecords } = 현재근무정보

    const 출근시간 = startRecord?.targetTime
    const 퇴근시간 = stopRecord?.targetTime

    const 현재근무상태: myClockData['현재근무상태'] = onGoing
        ? '근무중'
        : '퇴근'

    const 휴계시간 = 지금까지의휴계시간구하기({
        now,
        restRecords,
    })

    const 오늘일한시간 = 오늘일한시간구하기({
        출근시간,
        퇴근시간,
        now,
        휴계시간,
    })

    return {
        현재근무상태,
        출근시간,
        퇴근시간,
        오늘일한시간,
    }
}
