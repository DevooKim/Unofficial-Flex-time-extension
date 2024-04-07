import Browser from 'webextension-polyfill'

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
})()

Browser.commands.onCommand.addListener((command) => {
    if (command === 'toggle_tab') {
        Browser.runtime.sendMessage({
            type: 'toggle_tab',
        })
    }
})
