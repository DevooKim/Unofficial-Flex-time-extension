import axios from 'axios'
import { useEffect, useState } from 'react'
import browser from 'webextension-polyfill'

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
        const cachedHandler = async () => {
            const cachedData = (await browser.storage.local.get(
                'userIdHash'
            )) as {
                userIdHash: string
            }

            if (cachedData.userIdHash) {
                setUserIdHash(cachedData.userIdHash)
            } else {
                try {
                    const userIdHash = await fetch()

                    browser.storage.local.set({ userIdHash })

                    setUserIdHash(userIdHash)
                } catch (error) {
                    console.error('fetch UserIdHash error', error)
                    setIsError(true)
                }
            }
        }

        cachedHandler()
    }, [])

    return { data: userIdHash, isError }
}

export default useFetchUserIdHash
