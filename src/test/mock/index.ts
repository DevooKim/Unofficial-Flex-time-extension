import { setupWorker } from 'msw/browser'

import { fetchClockData } from './handlers/clockData'
import { fetchScheduleData } from './handlers/scheduleData'
import { fetchUserIdHash } from './handlers/userIdHash'

const handlers = [fetchUserIdHash, fetchClockData, fetchScheduleData]

export const worker = setupWorker(...handlers)
