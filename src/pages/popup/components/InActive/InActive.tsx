import Button from '@src/components/Button'

import { useOpenFlex } from '../../hooks'

const InActive = () => {
    const { openFlex } = useOpenFlex()
    return (
        <div className="flex items-center justify-center p-8">
            <Button
                className="w-100 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={openFlex}
            >
                플렉스로 이동하기
            </Button>
        </div>
    )
}

export default InActive
