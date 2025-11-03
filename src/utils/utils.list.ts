export const filterCount = <T>(list: T[], iter: (item: T) => boolean): number =>
    list.filter(iter).length
