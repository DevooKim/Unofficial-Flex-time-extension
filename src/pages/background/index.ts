import Browser from 'webextension-polyfill'

Browser.commands.onCommand.addListener((command) => {
    if (command === 'toggle_tab') {
        Browser.runtime.sendMessage({
            type: 'toggle_tab',
        })
    }

    if (command === 'toggle_time') {
        Browser.runtime.sendMessage({
            type: 'toggle_time',
        })
    }
})
