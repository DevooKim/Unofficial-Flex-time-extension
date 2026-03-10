import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { myTimeOffData } from '@src/types'
import { parseTimeOffData } from '@src/utils/parseTimeOffData'

type UseFetchTimeOffUses = {
    userIdHash: string
    timeStampFrom: number
    timeStampTo: number
    workingHoursPerDay: number
}

type FlexTimeOffResponse = Parameters<typeof parseTimeOffData>[0]['data']

const fetch = async (
    userIdHash: string,
    timeStampFrom: number,
    timeStampTo: number
): Promise<FlexTimeOffResponse> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/time-off/users/${userIdHash}/time-off-uses/by-use-date-range/${timeStampFrom}..${timeStampTo}?eventTypes=REGISTER`
    )

    return data
}

export const useFetchTimeOffUses = ({
    userIdHash,
    timeStampFrom,
    timeStampTo,
    workingHoursPerDay,
}: UseFetchTimeOffUses) =>
    useQuery<myTimeOffData>({
        queryKey: [
            'timeOffUses',
            userIdHash,
            timeStampFrom,
            timeStampTo,
            workingHoursPerDay,
        ],
        queryFn: async () =>
            parseTimeOffData({
                data: await fetch(userIdHash, timeStampFrom, timeStampTo),
                workingHoursPerDay,
            }),
        placeholderData: keepPreviousData,
    })
