export const filterCount = <T>(
    list: T[],
    iteratees: (item: T) => Boolean
): number => list.filter(iteratees).length;
