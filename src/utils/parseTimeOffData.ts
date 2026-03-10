import dayjs from 'dayjs'

import { myTimeOffData, myTimeOffDay, myTimeOffInfo } from '../types'
import { formatAmPm } from './utils.time'

type FlexTimeOffPolicy = {
    timeOffPolicyId: string
    displayInfo?: {
        name?: string
    }
}

type FlexTimeOffBlock = {
    userTimeOffRegisterEventId: string
    timeOffRegisterUnit: 'DAY' | 'HALF_DAY_AM' | 'HALF_DAY_PM' | string
    blockDate: string
    blockTimeFrom?: string
    blockTimeTo?: string
    usedMinutes: number
}

type FlexTimeOffUse = {
    userTimeOffRegisterEventId: string
    timeOffPolicyId: string
    timeOffPolicyType: 'ANNUAL' | 'CUSTOM' | string
    memo?: string
    userTimeOffRegisterEventBlocks: FlexTimeOffBlock[]
}

type FlexTimeOffResponse = {
    timeOffUses: FlexTimeOffUse[]
    annualTimeOffPolicy?: FlexTimeOffPolicy
    customTimeOffForms?: FlexTimeOffPolicy[]
}

const 요일맵: { [key: string]: string } = {
    0: '(일)',
    1: '(월)',
    2: '(화)',
    3: '(수)',
    4: '(목)',
    5: '(금)',
    6: '(토)',
}

const 반차단위맵: Record<string, 'morningHalf' | 'afternoonHalf' | 'full'> = {
    HALF_DAY_AM: 'morningHalf',
    HALF_DAY_PM: 'afternoonHalf',
}

const 반차라벨맵: Record<string, string> = {
    HALF_DAY_AM: '오전 반차',
    HALF_DAY_PM: '오후 반차',
}

const 휴가정책이름맵구하기 = (data: FlexTimeOffResponse) => {
    const policyMap = new Map<string, string>()

    const annualPolicyName = data.annualTimeOffPolicy?.displayInfo?.name
    if (data.annualTimeOffPolicy?.timeOffPolicyId && annualPolicyName) {
        policyMap.set(
            data.annualTimeOffPolicy.timeOffPolicyId,
            annualPolicyName
        )
    }

    data.customTimeOffForms?.forEach((form) => {
        if (form.timeOffPolicyId && form.displayInfo?.name) {
            policyMap.set(form.timeOffPolicyId, form.displayInfo.name)
        }
    })

    return policyMap
}

const 시간대텍스트구하기 = (block: FlexTimeOffBlock) => {
    if (!block.blockTimeFrom || !block.blockTimeTo) {
        return undefined
    }

    return `${formatAmPm(block.blockTimeFrom)} - ${formatAmPm(block.blockTimeTo)}`
}

const 유형라벨구하기 = ({
    policyName,
    timeOffRegisterUnit,
}: {
    policyName: string
    timeOffRegisterUnit: FlexTimeOffBlock['timeOffRegisterUnit']
}) => {
    const halfDayLabel = 반차라벨맵[timeOffRegisterUnit]
    if (!halfDayLabel) {
        return policyName
    }

    return policyName === '연차'
        ? halfDayLabel
        : `${policyName} (${halfDayLabel})`
}

const 휴가정보구하기 = ({
    use,
    block,
    policyName,
}: {
    use: FlexTimeOffUse
    block: FlexTimeOffBlock
    policyName: string
}): myTimeOffInfo => {
    const typeLabel = 유형라벨구하기({
        policyName,
        timeOffRegisterUnit: block.timeOffRegisterUnit,
    })
    const memo = use.memo?.trim()
    const timeRangeText = 시간대텍스트구하기(block)

    return {
        key: `${use.userTimeOffRegisterEventId}-${block.blockDate}-${block.timeOffRegisterUnit}`,
        label: memo ? `${typeLabel} / ${memo}` : typeLabel,
        memo,
        timeRangeText,
        minutes: block.usedMinutes,
        hours: block.usedMinutes / 60,
        displayType: 반차단위맵[block.timeOffRegisterUnit] || 'full',
    }
}

const 정렬된휴가정보목록구하기 = (dayMap: Map<string, myTimeOffDay>) =>
    [...dayMap.values()].sort((a, b) => a.rawDate.localeCompare(b.rawDate))

export const parseTimeOffData = ({
    data,
    workingHoursPerDay,
}: {
    data: FlexTimeOffResponse
    workingHoursPerDay: number
}): myTimeOffData => {
    const policyNameMap = 휴가정책이름맵구하기(data)
    const dayMap = new Map<string, myTimeOffDay>()

    data.timeOffUses.forEach((use) => {
        const policyName =
            policyNameMap.get(use.timeOffPolicyId) ||
            (use.timeOffPolicyType === 'ANNUAL' ? '연차' : '휴가')

        use.userTimeOffRegisterEventBlocks.forEach((block) => {
            const dayInfo = dayMap.get(block.blockDate) || {
                rawDate: block.blockDate,
                date: `${block.blockDate} ${요일맵[dayjs(block.blockDate).day().toString()]}`,
                infos: [],
                totalMinutes: 0,
                totalHours: 0,
            }

            const info = 휴가정보구하기({
                use,
                block,
                policyName,
            })

            dayInfo.infos.push(info)
            dayInfo.totalMinutes += info.minutes
            dayInfo.totalHours = dayInfo.totalMinutes / 60

            dayMap.set(block.blockDate, dayInfo)
        })
    })

    const 휴가정보list = 정렬된휴가정보목록구하기(dayMap)
    const totalMinutes = 휴가정보list.reduce(
        (acc, cur) => acc + cur.totalMinutes,
        0
    )

    return {
        휴가정보list,
        휴가일수: Number((totalMinutes / (workingHoursPerDay * 60)).toFixed(2)),
    }
}
