// import { ChromeMessage, Sender } from '../../types'

// type MessageResponse = (response?: any) => void

// const validateSender = (
//     message: ChromeMessage,
//     sender: chrome.runtime.MessageSender
// ) => sender.id === chrome.runtime.id && message.from === Sender.React

// const messagesFromReactAppListener = (
//     message: ChromeMessage,
//     sender: chrome.runtime.MessageSender,
//     sendResponse: MessageResponse
// ) => {
//     const isValidate = validateSender(message, sender)
// }

// const main = () => {
//     chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
// }

// main()
