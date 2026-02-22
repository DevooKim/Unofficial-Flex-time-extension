import { createRoot } from 'react-dom/client'

import '@src/styles/tailwind.css'

import Popup from '@popup/Popup'

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch((error) => {
                console.error(
                    '[PWA] Service Worker registration failed:',
                    error
                )
            })
        })
    }
}

// async function enableMocking() {
//     console.log(process.env.NODE_ENV)
//     if (process.env.NODE_ENV !== 'development') {
//         return
//     }

//     const { worker } = await import('@src/mocks/browser')

//     // `worker.start()` returns a Promise that resolves
//     // once the Service Worker is up and ready to intercept requests.
//     return worker.start()
// }

function init() {
    registerServiceWorker()

    const rootContainer = document.querySelector('#__root')
    if (!rootContainer) throw new Error("Can't find Popup root element")
    const root = createRoot(rootContainer)
    // enableMocking().then(() => {
    //     root.render(<Popup />)
    // })
    root.render(<Popup />)
}

init()
