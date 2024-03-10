import { createRoot } from 'react-dom/client'

import '@src/styles/tailwind.css'

import Popup from '@popup/Popup'

async function enableMocking() {
    if (!process.env.USE_MOCK) {
        return
    }

    const { worker } = await import('../../test/mock')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}

function init() {
    const rootContainer = document.querySelector('#__root')
    if (!rootContainer) throw new Error("Can't find Popup root element")
    const root = createRoot(rootContainer)
    root.render(<Popup />)
}

// init()
enableMocking().then(init)
