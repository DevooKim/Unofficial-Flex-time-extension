import { useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'

import ButtonToggleGroup from '@src/components/ButtonToggleGroup'

import TimeOff from './components/TimeOff'
import WorkingRecord from './components/WorkingRecord'

const ButtonKeyList = ['근무', '휴가'] as const

const TimeDataSwitch = () => {
    const [activeStatus, setActiveStatus] = useState<'근무' | '휴가'>('근무')

    const toggle = () =>
        setActiveStatus((prev) => (prev === '근무' ? '휴가' : '근무'))

    useEffect(() => {
        Browser.runtime.onMessage.addListener((message) => {
            if (message.type === 'toggle_tab') {
                console.log(message)
                toggle()
            }
        })
    }, [])

    return (
        <>
            <ButtonToggleGroup
                fullWidth
                defaultIndex={ButtonKeyList.indexOf(activeStatus)}
            >
                {ButtonKeyList.map((key) => (
                    <ButtonToggleGroup.Item
                        key={key}
                        onClick={() => setActiveStatus(key)}
                        value={key}
                    >
                        <div className="text-subtitle1">{key}</div>
                    </ButtonToggleGroup.Item>
                ))}
            </ButtonToggleGroup>
            {activeStatus === '근무' && <WorkingRecord />}
            {activeStatus === '휴가' && <TimeOff />}
        </>
    )
}

export default TimeDataSwitch
