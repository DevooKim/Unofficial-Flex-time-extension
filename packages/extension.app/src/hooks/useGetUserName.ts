import { useEffect, useState } from 'react'
import { ChromeMessage, Sender } from '../types'
import { getCurrentTabUId } from '../chrome/utils'

const useGetUserName = () => {
    const [userName, setUserName] = useState('')

    useEffect(() => {
        const message: ChromeMessage = {
            from: Sender.React,
            message: 'getUserName',
        }

        const options = {}
        getCurrentTabUId((id: number | undefined): void => {
            id &&
                chrome.tabs.sendMessage(id, message, options, (response) => {
                    setUserName(response)
                })
        })
    }, [])

    return userName
}

export default useGetUserName
