import dayjs from 'dayjs'
import { useBaseTimeContext } from '../../contexts/BaseTimeContext'

import GlobalIcon from '@src/icons/GlobalIcon'
import IconButton from '@src/components/IconButton'
import { useOpenFlex } from '@src/hooks'

const Header = () => {
    const { baseTimeData } = useBaseTimeContext()
    const { openFlex } = useOpenFlex()

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm text-alternative">
                오늘 {dayjs(baseTimeData.today).format('YYYY.MM.DD')}
            </div>

            <IconButton
                icon={<GlobalIcon className="h-6 w-6 fill-link" />}
                onClick={openFlex}
            />
        </div>
    )
}

export default Header
