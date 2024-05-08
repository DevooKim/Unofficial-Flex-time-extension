import React from 'react'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'

type IconButtonProps = ButtonProps & {
    icon?: React.ReactElement
}

const IconButton = ({ icon, ...props }: IconButtonProps) => (
    <Button {...props}>
        <div className="flex items-center justify-center">{icon}</div>
    </Button>
)

export default IconButton
