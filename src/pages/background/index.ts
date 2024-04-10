import Browser from 'webextension-polyfill'

import { getCurrentSession } from '@src/utils/apis'

console.log('Hello world, background service worker!')

const fetchUserIdHash = async () => {
    const response = await fetch(
        'https://flex.team/api/v2/core/users/me/user-settings'
    )
    const { userIdHash } = (await response.json()).setting
    return userIdHash
}

const fetchWorkingData = async ({
    userIdHash,
    timeStampFrom = Date.now(),
    timeStampTo = Date.now(),
}: {
    userIdHash: string
    timeStampFrom?: number
    timeStampTo?: number
}) => {
    const response = await fetch(
        `https://flex.team/api/v2/time-tracking/work-clock/users?userIdHashes=${userIdHash}&timeStampFrom=${timeStampFrom}&timeStampTo=${timeStampTo}`
    )

    const { records } = (await response.json()).records[0]
    return records
}

const fetchScheduleData = async ({
    userIdHash,
    timeStampFrom = Date.now(),
    timeStampTo = Date.now(),
}: {
    userIdHash: string
    timeStampFrom?: number
    timeStampTo?: number
}) => {
    const response = await fetch(
        `https://flex.team/api/v2/time-tracking/users/${userIdHash}/periods/work-schedules?timeStampFrom=${timeStampFrom}&timeStampTo=${timeStampTo}`
    )

    return await response.json()
}

const fetchMyCurrentStatus = async () => {
    const userIdHash = await fetchUserIdHash()

    const response = await fetch(
        `https://flex.team/api/v2/time-tracking/work-clock/users/${userIdHash}/current-status`
    )

    const { targetDayWorkSchedule } = await response.json()
    return targetDayWorkSchedule
}

const searchUsers = async ({
    keyword,
    filter,
    sort,
    size,
    continuationToken,
} = {}) => {
    console.log('searching users...')
    const makePagingQuery = ({ size, continuationToken } = {}) => {
        const queries = []
        if (size) {
            queries.push(`size=${size}`)
        }
        if (continuationToken) {
            queries.push(`continuationToken=${continuationToken}`)
        }
        return queries.length ? `?${queries.join('&')}` : ''
    }
    const response = await fetch(
        `https://flex.team/action/v2/search/customers/pVEkBrmzMB/time-series/search-users${makePagingQuery({ size, continuationToken })}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...(keyword && { keyword }),
                ...(sort && { sort }),
                filter: {
                    jobTitleIdHashes: [...(filter?.jobTitleIdHashes ?? [])],
                    jobRankIdHashes: [...(filter?.jobRankIdHashes ?? [])],
                    jobRoleIdHashes: [...(filter?.jobRoleIdHashes ?? [])],
                    departmentIdHashes: [...(filter?.departmentIdHashes ?? [])],
                    headUsers: [...(filter?.headUsers ?? [])],
                    userStatuses: [
                        'LEAVE_OF_ABSENCE',
                        'LEAVE_OF_ABSENCE_SCHEDULED',
                        'RESIGNATION_SCHEDULED',
                        'IN_EMPLOY',
                        'IN_APPRENTICESHIP',
                    ],
                },
                // sort: {
                //     sortType: 'DISPLAY_NAME',
                //     directionType: 'ASC',
                // },
            }),
        }
    )

    console.log(await response.json())

    return true
}

const fetchPrimaryWorkspaceCustomer = async () => {
    const userIdHash = await fetchUserIdHash()
    const response = await fetch(`
    https://flex.team/api/v2/workspace/users/${userIdHash}/workspace-customers
    `)

    const { workspaceCustomers, count } = await response.json()

    if (count === 1) {
        return workspaceCustomers[0]
    } else {
        return workspaceCustomers.filter(({ isPrimary }) => isPrimary)[0] ?? []
    }
}

// function sendNotification(notiId, msg, dwellingTimeMs) {
//     //clear noti for fast notification
//     chrome.notifications.clear(notiId, () => {})

//     chrome.notifications.create(notiId, {
//         type: 'basic',
//         title: 'mytitle',
//         iconUrl: 'icons/icon128.png',
//         message: msg,
//         priority: 2, // -2 to 2 (highest)

//         // buttons: [
//         //     {
//         //         title: '저장'
//         //     },
//         //     {
//         //         title: '취소'
//         //     }
//         // ],

//         eventTime: Date.now(),
//     })

//     setTimeout(() => {
//         chrome.notifications.clear(notiId, () => {})
//     }, dwellingTimeMs)
// }

;(async function main() {
    // setInterval(() => {
    //     sendNotification('0x00001', 'testtest', 3000)
    // }, 5000)
    console.log('this is main function')
    const userIdHash = await fetchUserIdHash()
    console.log(userIdHash)
    const workingData = await fetchWorkingData({
        userIdHash,
    })
    console.log(workingData)
    const scheduleData = await fetchScheduleData({
        userIdHash,
        timeStampFrom: new Date('2024-02-28').getTime(),
        timeStampTo: new Date('2024-02-28').getTime(),
    })
    console.log(scheduleData)

    const myCurrentStatus = await fetchMyCurrentStatus()
    console.log(myCurrentStatus)

    const users = await searchUsers({ size: 100 })
    console.log(users)

    const primaryWorkspaceCustomer = await fetchPrimaryWorkspaceCustomer()
    console.log(primaryWorkspaceCustomer)

    const currentSession = await getCurrentSession()
    console.log(currentSession)
})()

Browser.commands.onCommand.addListener((command) => {
    if (command === 'toggle_tab') {
        Browser.runtime.sendMessage({
            type: 'toggle_tab',
        })
    }
})
