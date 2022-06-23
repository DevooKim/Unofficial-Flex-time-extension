import {
    getCurrentWorkingMinutesAvg,
    getMinRemainWorkingMinutes,
    getMinRemainWorkingMinutesAvg,
    getMinWorkingMinutes,
    getTotalWorkingMinutes,
    getWorkingMinutesWeekAvg,
    getWorkingDay,
} from '../src/service/calc'
import { data } from './dummyData'

describe('시간 계산이 잘 되는가', () => {
    it('이번달 해야하는 최소 근무시간', () => {
        const result = getMinWorkingMinutes(19.5)
        expect(result).toBe(9360)
    })

    it('이번달 총 근무 시간 (연차 포함)', () => {
        const result = getTotalWorkingMinutes(data.paidSummary)
        const offsetResult = result - (result % 10)
        expect(offsetResult).toBe(10180)
    })

    it('월 평균 주 근무시간', () => {
        const totalWorkingMinutes = getTotalWorkingMinutes(data.paidSummary)
        const result = getWorkingMinutesWeekAvg(totalWorkingMinutes)
        expect(result).toBeCloseTo(2343.1530494822)
    })

    it('현재 평균 소정 근무시간 (일)', () => {
        const result = getCurrentWorkingMinutesAvg({
            workedMinutes: data.paidSummary.actualWorkingMinutes,
            workedDay: 19.5,
        })
        expect(result).toBeCloseTo(485.17948717955)
    })

    it('남은 최소 근무시간1', () => {
        const result = getMinRemainWorkingMinutes({
            minWorkingMinutes: getMinWorkingMinutes(19.5),
            workedMinutes: data.paidSummary.actualWorkingMinutes,
        })

        const resultAvg = getMinRemainWorkingMinutesAvg({
            minRemainWorkingMinutes: result,
            remainActualWorkingDayCount: 0,
        })
        expect(result).toBe(0)
        expect(resultAvg).toBe(0)
    })

    it('남은 최소 근무시간2', () => {
        const result = getMinRemainWorkingMinutes({
            minWorkingMinutes: getMinWorkingMinutes(19.5),
            workedMinutes: getMinWorkingMinutes(19.5) - 1200,
        })

        const resultAvg = getMinRemainWorkingMinutesAvg({
            minRemainWorkingMinutes: result,
            remainActualWorkingDayCount: 3,
        })
        expect(result).toBe(1200)
        expect(resultAvg).toBe(400)
    })

    it('근무일 정보', () => {
        jest.useFakeTimers().setSystemTime(new Date('2022-05-07'))

        const days = data.days
        const {
            workingDayCount,
            actualWorkingDayCount,
            workedDayCount,
            actualWorkedDayCount,
        } = getWorkingDay(days)

        expect(workingDayCount).toBe(21)
        expect(actualWorkingDayCount).toBe(19.5)
        expect(workedDayCount).toBe(4)
        expect(actualWorkedDayCount).toBe(2.5)
    })
})

export {}
