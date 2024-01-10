import axios from 'axios'
import { useEffect, useState } from 'react'

interface UseFetchUserIdHashType {
    data: string
    isError: boolean
}

const fetch = async () => {
    const { data } = await axios.get(
        'https://flex.team/api/v2/core/users/me/user-settings'
    )
    const { userIdHash } = data.setting

    return userIdHash
}
const useFetchUserIdHash = (): UseFetchUserIdHashType => {
    const [userIdHash, setUserIdHash] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)

    useEffect(() => {
        chrome.storage.local.get(['userIdHash'], async (result) => {
            if (result.userIdHash) {
                setUserIdHash(result.userIdHash)
            } else {
                try {
                    const userIdHash = await fetch()

                    chrome.storage.local.set({ userIdHash }, () => {
                        setUserIdHash(userIdHash)
                    })
                } catch (error) {
                    console.error('fetch UserIdHash error', error)
                    setIsError(true)
                }
            }
        })
    }, [])

    return { data: userIdHash, isError }
}

export default useFetchUserIdHash
