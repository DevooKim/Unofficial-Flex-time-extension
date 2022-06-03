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
