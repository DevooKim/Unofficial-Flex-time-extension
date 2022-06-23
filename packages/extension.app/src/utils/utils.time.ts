export const dayToMinutes = (day: number): number => day * 8 * 60

export const safeDivision = (
    denominator: number,
    numerator: number
): number => {
    const result = Number((denominator / numerator).toFixed(2))
    return isFinite(result) ? result : 0
}
