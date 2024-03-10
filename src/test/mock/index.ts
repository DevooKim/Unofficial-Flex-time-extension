import { setupWorker } from 'msw/browser'

import { fetchClockData } from './handlers/clockData'
import { fetchUserIdHash } from './handlers/userIdHash'

const handlers = [fetchUserIdHash, fetchClockData]

export const worker = setupWorker(...handlers)
