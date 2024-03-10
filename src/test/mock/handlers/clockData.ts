import { HttpResponse, http } from 'msw'

const mockData = {
    출근전: {
        records: [
            {
                userIdHash: `mockUser`,
                records: [
                    {
                        appliedDate: '2024-03-04',
                        workClockRecordPacks: [
                            {
                                startRecord: {
                                    eventType: 'START',
                                    targetTime: 1709510520000,
                                    customerWorkFormId: '10673',
                                    recordType: 'RECORD',
                                    zoneId: 'Asia/Seoul',
                                },
                                switchRecords: [],
                                stopRecord: {
                                    eventType: 'STOP',
                                    targetTime: 1709548620000,
                                    recordType: 'RECORD',
                                    zoneId: 'Asia/Seoul',
                                },
                                restRecords: [
                                    {
                                        restStartRecord: {
                                            eventType: 'REST_START',
                                            customerWorkFormId: '10674',
                                            targetTime: 1709523000000,
                                            recordType: 'RECORD',
                                            zoneId: 'Asia/Seoul',
                                        },
                                        restStopRecord: {
                                            eventType: 'REST_STOP',
                                            targetTime: 1709526600000,
                                            recordType: 'RECORD',
                                            zoneId: 'Asia/Seoul',
                                        },
                                    },
                                ],
                                onGoing: false,
                            },
                        ],
                        appliedZoneId: 'Asia/Seoul',
                    },
                    {
                        appliedDate: '2024-03-05',
                        workClockRecordPacks: [
                            {
                                startRecord: {
                                    eventType: 'START',
                                    targetTime: 1709601300000,
                                    customerWorkFormId: '10673',
                                    recordType: 'RECORD',
                                    zoneId: 'Asia/Seoul',
                                },
                                switchRecords: [],
                                stopRecord: {
                                    eventType: 'STOP',
                                    targetTime: 1709635020000,
                                    recordType: 'RECORD',
                                    zoneId: 'Asia/Seoul',
                                },
                                restRecords: [
                                    {
                                        restStartRecord: {
                                            eventType: 'REST_START',
                                            customerWorkFormId: '10674',
                                            targetTime: 1709609400000,
                                            recordType: 'RECORD',
                                            zoneId: 'Asia/Seoul',
                                        },
                                        restStopRecord: {
                                            eventType: 'REST_STOP',
                                            targetTime: 1709613000000,
                                            recordType: 'RECORD',
                                            zoneId: 'Asia/Seoul',
                                        },
                                    },
                                ],
                                onGoing: false,
                            },
                        ],
                        appliedZoneId: 'Asia/Seoul',
                    },
                ],
            },
        ],
    },
    근무중: {},
    퇴근: {},
}

export const fetchClockData = http.get(
    `https://flex.team/api/v2/time-tracking/work-clock/users`,
    () => {
        const result = mockData[window.mockType]
        return HttpResponse.json(result)
    }
)
