import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'
import browser from 'webextension-polyfill'

const fetch = async () => {
    const { data } = await axios.get(
        'https://flex.team/api/v2/core/users/me/user-settings'
    )
    const { userIdHash } = data.setting

    return userIdHash
}

export const useFetchUserIdHash = () =>
    useSuspenseQuery({
        queryKey: ['userIdHash'],
        queryFn: async () => {
            const result = await browser.storage.local.get('userIdHash')

            if (result.userIdHash) {
                return result.userIdHash
            } else {
                const userIdHash = await fetch()

                browser.storage.local.set({ userIdHash })
                return userIdHash
            }
        },
    })
