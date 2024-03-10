import { HttpResponse, http } from 'msw'

import mockData from './scheduleData.json'

export const fetchScheduleData = http.get(
    `https://flex.team/api/v2/time-tracking/users/:userIdHash/periods/work-schedules`,
    () => {
        const result = mockData[window.mockType]

        return HttpResponse.json(result)
    }
)
