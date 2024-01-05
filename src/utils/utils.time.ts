export const dayToMinutes = (day: number): number => day * 8 * 60

export const safeDivision = (
    denominator: number,
    numerator: number
): number => {
    const result = Number((denominator / numerator).toFixed(2))
    return isFinite(result) ? result : 0
}

export const hourToString = (time: number): string => {
    const hour = Math.floor(time)
    const min = Math.round(+(time % 1).toFixed(2) * 60)
    return `${hour}시간 ${min}분`
}
