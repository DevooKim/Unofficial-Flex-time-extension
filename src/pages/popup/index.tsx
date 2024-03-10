import { createRoot } from 'react-dom/client'

import '@src/styles/tailwind.css'

import Popup from '@popup/Popup'

function init() {
    const rootContainer = document.querySelector('#__root')
    if (!rootContainer) throw new Error("Can't find Popup root element")
    const root = createRoot(rootContainer)
    root.render(<Popup />)
}

init()
