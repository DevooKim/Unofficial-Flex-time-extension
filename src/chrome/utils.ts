export const getCurrentTabUrl = (
    callback: (url: string | undefined) => void
): void => {
    const queryInfo = { active: true, currentWindow: true };

    chrome.tabs?.query(queryInfo, (tabs) => {
        callback(tabs[0].url);
    });
};

export const getCurrentTabUId = (
    callback: (url: number | undefined) => void
): void => {
    const queryInfo = { active: true, currentWindow: true };

    chrome.tabs?.query(queryInfo, (tabs) => {
        callback(tabs[0].id);
    });
};

export const activeTabHandler = (
    tab: chrome.tabs.Tab,
    callback: (isActive: boolean) => void
) => {
    const isWorkingInfoTab =
        tab.url === "https://flex.team/time-tracking/work-record/my";
    isWorkingInfoTab
        ? chrome.action.enable(tab.id)
        : chrome.action.disable(tab.id);

    callback(isWorkingInfoTab);
};
