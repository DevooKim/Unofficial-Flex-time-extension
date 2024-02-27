import browser from 'webextension-polyfill'

const ORIGIN_URL = 'https://flex.team'

export const getCurrentTabUrl = async (
    callback: (url: string | undefined) => void
): Promise<void> => {
    const queryInfo = { active: true, currentWindow: true }

    const tabs = await browser.tabs?.query(queryInfo)
    callback(tabs[0].url)
}

export const getCurrentTabUId = async (
    callback: (url: number | undefined) => void
): Promise<void> => {
    const queryInfo = { active: true, currentWindow: true }

    const tabs = await browser.tabs?.query(queryInfo)
    // await callback(tabs[0].id)
    callback(tabs[0].id)
}

export type tabStatus = {
    isWorkingInfoTab: boolean
    isComplete: boolean
}

export const activeTabHandler = (
    tab: browser.tabs.Tab,
    callback: (status: tabStatus) => void
) => {
    if (!tab.url) return

    const url = new URL(tab.url)

    const isWorkingInfoTab = url.origin === ORIGIN_URL

    const isComplete = tab.status === 'complete'

    isWorkingInfoTab
        ? browser.action.enable(tab.id)
        : browser.action.disable(tab.id)

    callback({ isWorkingInfoTab, isComplete })
}
