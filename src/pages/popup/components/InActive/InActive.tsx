import Button from '@src/components/Button'

import { useOpenFlex } from '../../hooks'

const InActive = () => {
    const { openFlex } = useOpenFlex()
    return (
        <div>
            <Button onClick={openFlex}>플렉스로 이동하기</Button>
        </div>
    )
}

export default InActive
