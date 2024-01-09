import { flexClockData, myClockData } from '../types'
import dayjs from 'dayjs'

const 현재근무정보구하기 = ({
    now,
    records,
}: {
    now: number
    records: flexClockData['records']
}) => {
    // 한국 시간으로 yyyy-mm-dd
    const currentDate = dayjs(now).format('YYYY-MM-DD')

    const todayRecords = records.find(
        ({ appliedDate }) => appliedDate === currentDate
    )

    return todayRecords?.workClockRecordPacks[0]
}

const 오늘일한시간구하기 = ({
    출근시간,
    퇴근시간,
    now,
    restRecords,
}: {
    출근시간: number | undefined
    퇴근시간: number | undefined
    now: number
    restRecords: flexClockData['records'][0]['workClockRecordPacks'][0]['restRecords']
}) => {
    const key = 퇴근시간 || now

    const 휴계시간 = restRecords.reduce(
        (acc, { restStartRecord, restStopRecord }) => {
            const { targetTime: startTargetTime, recordType: startRecordType } =
                restStartRecord
            const { targetTime: stopTargetTime, recordType: stopRecordType } =
                restStopRecord || {}

            const start = startRecordType !== 'RECORD' ? now : startTargetTime

            const stop = stopRecordType !== 'RECORD' ? now : stopTargetTime

            return acc + dayjs(stop).diff(dayjs(start), 'minute')
        },
        0
    )

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

    const 오늘일한시간 = 오늘일한시간구하기({
        출근시간,
        퇴근시간,
        now,
        restRecords,
    })

    return {
        현재근무상태,
        출근시간,
        퇴근시간,
        오늘일한시간,
    }
}