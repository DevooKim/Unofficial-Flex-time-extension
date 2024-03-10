import React from 'react'

import Button from '../Button'
import { ButtonProps } from '../Button/Button'

type IconButtonProps = ButtonProps & {
    icon?: React.ReactElement
}

const IconButton = ({ icon, ...props }: IconButtonProps) => (
    <Button {...props}>{icon}</Button>
)

export default IconButton
