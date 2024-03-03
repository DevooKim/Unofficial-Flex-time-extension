import { useState } from 'react'

import ButtonToggleGroup from '@src/components/ButtonToggleGroup'

import TimeOff from './components/TimeOff'
import WorkingRecord from './components/WorkingRecord'

const TimeDataSwitch = () => {
    const [activeStatus, setActiveStatus] = useState<'근무' | '휴가'>('근무')

    return (
        <>
            <ButtonToggleGroup fullWidth>
                <ButtonToggleGroup.Item
                    onClick={() => setActiveStatus('근무')}
                    value="근무"
                >
                    <div className="text-subtitle1">근무</div>
                </ButtonToggleGroup.Item>
                <ButtonToggleGroup.Item
                    onClick={() => setActiveStatus('휴가')}
                    value="휴가"
                >
                    <div className="text-subtitle1">휴가</div>
                </ButtonToggleGroup.Item>
            </ButtonToggleGroup>
            {activeStatus === '근무' && <WorkingRecord />}
            {activeStatus === '휴가' && <TimeOff />}
        </>
    )
}

export default TimeDataSwitch
