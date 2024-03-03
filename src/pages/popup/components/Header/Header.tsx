import dayjs from 'dayjs'

import IconButton from '@src/components/IconButton'
import { useOpenFlex } from '@src/hooks'
import GlobalIcon from '@src/icons/GlobalIcon'

import { useBaseTimeContext } from '@popup/contexts/BaseTimeContext'

const Header = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { openFlex } = useOpenFlex()

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-alternative">
                오늘 {dayjs(baseTimeData.today).format('YYYY.MM.DD')}
            </div>
            <IconButton
                icon={<GlobalIcon className="w-6 h-6 fill-link" />}
                onClick={openFlex}
            />
        </div>
    )
}

export default Header
