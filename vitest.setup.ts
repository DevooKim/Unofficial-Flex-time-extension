import { afterAll, afterEach, beforeAll } from 'vitest'

import { server } from './src/mocks/node.ts'

beforeAll(() => {
    server.listen()
})

afterEach(() => {
    server.resetHandlers()
})

afterAll(() => {
    server.close()
})
