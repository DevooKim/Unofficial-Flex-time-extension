import { setupWorker } from 'msw/browser'

import { fetchUserIdHash } from './handlers/userIdHash'

const handlers = [fetchUserIdHash]

export const worker = setupWorker(...handlers)
