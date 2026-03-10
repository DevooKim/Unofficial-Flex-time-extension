import { keepPreviousData, useQuery } from '@tanstack/react-query'
import axios from 'axios'

import { myHolidayData } from '@src/types'
import { parseWorkingDayAttributes } from '@src/utils/parseWorkingDayAttributes'

type UseFetchWorkingDayAttributes = {
    userIdHash: string
    from: string
    to: string
    timezone: string
}

type WorkingDayAttributesResponse = Parameters<
    typeof parseWorkingDayAttributes
>[0]['data']

const fetch = async (
    userIdHash: string,
    from: string,
    to: string,
    timezone: string
): Promise<WorkingDayAttributesResponse> => {
    const { data } = await axios.get(
        `https://flex.team/api/v3/time-tracking/users/${userIdHash}/work-schedules/date-attributes?from=${from}&to=${to}&timezone=${encodeURIComponent(timezone)}`
    )

    return data
}

export const useFetchWorkingDayAttributes = ({
    userIdHash,
    from,
    to,
    timezone,
}: UseFetchWorkingDayAttributes) =>
    useQuery<myHolidayData>({
        queryKey: ['workingDayAttributes', userIdHash, from, to, timezone],
        queryFn: async () =>
            parseWorkingDayAttributes({
                data: await fetch(userIdHash, from, to, timezone),
            }),
        placeholderData: keepPreviousData,
    })
