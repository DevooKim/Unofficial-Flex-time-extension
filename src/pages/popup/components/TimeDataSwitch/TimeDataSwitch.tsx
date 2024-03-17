import { FloatingPortal, useHover } from '@floating-ui/react'
import { useEffect, useState } from 'react'
import Browser from 'webextension-polyfill'

import ButtonToggleGroup from '@src/components/ButtonToggleGroup'
import useMyFloating from '@src/hooks/useMyFloating'

import TimeOff from './components/TimeOff'
import WorkingRecord from './components/WorkingRecord'

const ButtonKeyList = ['근무', '휴가'] as const

const TimeDataSwitch = () => {
    const [activeStatus, setActiveStatus] = useState<'근무' | '휴가'>('근무')

    const { floating, getFloatingInteraction, isOpen } = useMyFloating({
        placement: 'bottom',
        delay: {
            open: 750,
        },
        offset: ({ rects }) => ({
            crossAxis: rects.floating.width - 8,
            mainAxis: 4,
        }),
    })

    const floatingInteraction = getFloatingInteraction()

    const toggle = () =>
        setActiveStatus((prev) => (prev === '근무' ? '휴가' : '근무'))

    useEffect(() => {
        Browser.runtime.onMessage.addListener((message) => {
            if (message.type === 'toggle_tab') {
                toggle()
            }
        })
    }, [])

    return (
        <>
            <div ref={floating.refs.setReference}>
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
            </div>

            {activeStatus === '근무' && <WorkingRecord />}
            {activeStatus === '휴가' && <TimeOff />}
            <FloatingPortal>
                {isOpen && (
                    <div
                        ref={floating.refs.setFloating}
                        className="tooltip"
                        style={floating.floatingStyles}
                        {...floatingInteraction.getFloatingProps()}
                    >
                        Option + shift + E
                    </div>
                )}
            </FloatingPortal>
        </>
    )
}

export default TimeDataSwitch
