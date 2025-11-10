import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'
import browser from 'webextension-polyfill'

import { CurrentWorkRule } from '@src/types'

const fetch = async (userIdHash: string): Promise<CurrentWorkRule> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/work-rule/users/${userIdHash}/work-rules/current`
    )

    return data
}

export const useFetchCurrentWorkRule = (userIdHash: string) =>
    useSuspenseQuery({
        queryKey: ['currentWorkRule', userIdHash],
        queryFn: async () => {
            const result = await browser.storage.session.get('currentWorkRule')

            if (result.currentWorkRule) {
                return result.currentWorkRule as CurrentWorkRule
            } else {
                const workRule = await fetch(userIdHash)

                browser.storage.session.set({ currentWorkRule: workRule })
                return workRule
            }
        },
        enabled: !!userIdHash,
    })
