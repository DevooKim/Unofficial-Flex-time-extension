import { myHolidayData, myHolidayDay, myHolidayInfo } from '../types'

type WorkingDayDayOff = {
    date: string
    name: string
    type: 'REST_DAY' | 'WEEKLY_HOLIDAY' | 'CUSTOM_HOLIDAY' | string
}

type WorkingDayAttribute = {
    date: string
    dayOffs: WorkingDayDayOff[]
}

type WorkingDayAttributesResponse = {
    workingDayAttributes: WorkingDayAttribute[]
}

const 휴일유형라벨맵: Record<string, string> = {
    REST_DAY: '휴무일',
    WEEKLY_HOLIDAY: '주휴일',
    CUSTOM_HOLIDAY: '지정 휴일',
}

const 휴일라벨구하기 = ({ name, type }: WorkingDayDayOff) => {
    const typeLabel = 휴일유형라벨맵[type] || type

    return name === typeLabel ? name : `${typeLabel} · ${name}`
}

const 정렬된휴일정보목록구하기 = (dayMap: Map<string, myHolidayDay>) =>
    [...dayMap.values()].sort((a, b) => a.rawDate.localeCompare(b.rawDate))

export const parseWorkingDayAttributes = ({
    data,
}: {
    data: WorkingDayAttributesResponse
}): myHolidayData => {
    const dayMap = new Map<string, myHolidayDay>()

    data.workingDayAttributes.forEach(({ date, dayOffs }) => {
        if (dayOffs.length === 0) {
            return
        }

        const infos = dayOffs.map(
            ({ name, type }, index): myHolidayInfo => ({
                key: `${date}-${type}-${index}`,
                name,
                type,
                label: 휴일라벨구하기({ date, name, type }),
            })
        )

        dayMap.set(date, {
            rawDate: date,
            infos,
        })
    })

    return {
        휴일정보list: 정렬된휴일정보목록구하기(dayMap),
    }
}
