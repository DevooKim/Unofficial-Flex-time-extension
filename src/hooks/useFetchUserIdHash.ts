import axios from 'axios'
import { useEffect, useState } from 'react'

const fetch = async (callback: (res: string) => void) => {
    const { data } = await axios.get(
        'https://flex.team/api/v2/core/users/me/user-settings'
    )
    const { userIdHash } = data.setting

    chrome.storage.local.set({ userIdHash }, () => {
        callback(userIdHash)
    })
}
const useFetchUserIdHash = (): string => {
    const [userIdHash, setUserIdHash] = useState<string>('')

    useEffect(() => {
        chrome.storage.local.get(['userIdHash'], (result) => {
            if (result.userIdHash) {
                setUserIdHash(result.userIdHash)
            } else {
                fetch(setUserIdHash)
            }
        })
    }, [])

    return userIdHash
}

export default useFetchUserIdHash
