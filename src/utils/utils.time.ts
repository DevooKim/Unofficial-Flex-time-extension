import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const dayToMinutes = (day: number): number => day * 8 * 60

export const safeDivision = (
    denominator: number,
    numerator: number
): number => {
    const result = Number((denominator / numerator).toFixed(2))
    return isFinite(result) ? result : 0
}

export const hourToString = (time: number): string => {
    let hour = Math.floor(time)
    let min = Math.round(+(time % 1).toFixed(2) * 60)

    if (min === 60) {
        hour += 1
        min = 0
    }

    return `${hour}시간 ${min}분`
}

export const formatAmPm = (time: string | number) =>
    dayjs(time)
        .utc()
        .local()
        .format('A hh:mm')
        .replace('AM', '오전')
        .replace('PM', '오후')
