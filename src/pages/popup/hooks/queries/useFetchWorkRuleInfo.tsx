import { useSuspenseQuery } from '@tanstack/react-query'
import axios from 'axios'
import browser from 'webextension-polyfill'

import { WorkRuleInfo } from '@src/types'

const fetch = async (
    customerIdHash: string,
    customerWorkRuleId: string
): Promise<WorkRuleInfo> => {
    const { data } = await axios.get(
        `https://flex.team/api/v2/work-rule/customers/${customerIdHash}/work-rules/${customerWorkRuleId}`
    )

    return data
}

export const useFetchWorkRuleInfo = (
    customerIdHash: string,
    customerWorkRuleId: string
) =>
    useSuspenseQuery({
        queryKey: ['workRuleInfo', customerIdHash, customerWorkRuleId],
        queryFn: async () => {
            const cacheKey = `workRuleInfo_${customerWorkRuleId}`
            const result = await browser.storage.session.get(cacheKey)

            if (result[cacheKey]) {
                return result[cacheKey] as WorkRuleInfo
            } else {
                const workRuleInfo = await fetch(
                    customerIdHash,
                    customerWorkRuleId
                )

                browser.storage.session.set({ [cacheKey]: workRuleInfo })
                return workRuleInfo
            }
        },
        enabled: !!customerIdHash && !!customerWorkRuleId,
    })
