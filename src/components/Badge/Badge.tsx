import cn from 'classnames'

import './Badge.css'

type BadgeProps = {
    className?: string
    color: 'primary' | 'warning' | 'info'
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

const colorVariant = {
    primary: 'badge-primary',
    warning: 'badge-warning',
    info: 'badge-info',
}
const sizeVariant = {
    sm: 'badge-sm',
    md: 'badge-md',
    lg: 'badge-lg',
}

const Badge = ({
    className,
    color = 'primary',
    size = 'md',
    children,
}: BadgeProps) => (
    <span
        className={cn(
            'badge',
            className,
            colorVariant[color],
            sizeVariant[size]
        )}
    >
        {children}
    </span>
)

export default Badge
