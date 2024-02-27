import browser from 'webextension-polyfill'
interface UseOpenFlexType {
    openFlex: () => void
}

const useOpenFlex = (): UseOpenFlexType => {
    const openFlex = () => {
        browser.tabs.create({ url: 'https://flex.team' })
    }

    return { openFlex }
}

export default useOpenFlex
