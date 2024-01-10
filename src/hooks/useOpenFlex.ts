interface UseOpenFlexType {
    openFlex: () => void
}

const useOpenFlex = (): UseOpenFlexType => {
    const openFlex = () => {
        chrome.tabs.create({ url: 'https://flex.team' })
    }

    return { openFlex }
}

export default useOpenFlex
