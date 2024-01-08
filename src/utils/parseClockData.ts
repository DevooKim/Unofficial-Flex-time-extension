import { flexClockData, myClockData } from '../types'

const 현재근무정보구하기 = ({
    now,
    records,
}: {
    now: number
    records: flexClockData['records']
}) => {
    // 한국 시간으로 yyyy-mm-dd
    const currentDate = new Date(now + 9 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]

    const todayRecords = records.find(
        ({ appliedDate }) => appliedDate === currentDate
    )

    return todayRecords?.workClockRecordPacks[0]
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
            현재근무상태: '출근 전',
            출근시간: 0,
            퇴근시간: 0,
        }
    }

    const { startRecord, stopRecord, onGoing } = 현재근무정보

    const 출근시간 = startRecord.targetTime
    const 퇴근시간 = stopRecord.targetTime

    const 현재근무상태: myClockData['현재근무상태'] = onGoing
        ? '근무 중'
        : '퇴근'

    return {
        현재근무상태,
        출근시간,
        퇴근시간,
    }
}
