import cn from 'classnames'
import React, { Children, useEffect, useRef, useState } from 'react'

import Button from '../Button'

type ButtonToggleGroupItemProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    isActive?: boolean
    children?: React.ReactNode
    className?: string
    fullWidth?: boolean
}

type ButtonToggleGroupProps = {
    fullWidth?: boolean
    children: React.ReactNode
    defaultIndex?: number
}

const ButtonToggleGroupItem = ({
    isActive,
    className,
    fullWidth,
    children,
    ...props
}: ButtonToggleGroupItemProps) => {
    const activeClassName = `hover:bg-white bg-white border-gray-300 text-gray-800`

    return (
        <li className={cn('z-[1]', { 'w-full': fullWidth })}>
            <Button
                className={cn(
                    'bg-transparent border-transparent rounded-lg text-gray-500 transition-colors duration-[250ms] ease-in-out hover:bg-gray-600/[.16]',
                    { [activeClassName]: isActive },
                    { 'w-full': fullWidth },
                    className
                )}
                {...props}
            >
                {children}
            </Button>
        </li>
    )
}

const ButtonToggleGroup = ({
    fullWidth,
    defaultIndex = 0,
    children,
}: ButtonToggleGroupProps) => {
    const ref = useRef<HTMLUListElement>(null)
    const [activeIndex, setActiveIndex] = useState(defaultIndex)
    const [maskRect, setMaskRect] = useState<DOMRect | null>(null)

    useEffect(() => {
        if (!ref.current) {
            return
        }

        const parent = ref.current as HTMLUListElement
        const childrenLi = parent.getElementsByTagName('li')

        const rectList = Array.from(childrenLi).map((li) =>
            li.getBoundingClientRect()
        )

        setMaskRect(rectList[activeIndex])
    }, [activeIndex])

    useEffect(() => {
        setActiveIndex(defaultIndex)
    }, [defaultIndex])

    return (
        <div
            className={cn('inline-flex rounded-[0.625rem] border bg-gray-100', {
                'w-full': fullWidth,
            })}
        >
            <ul
                className={cn('relative m-0.5 flex gap-1 p-0', {
                    'w-full': fullWidth,
                })}
                ref={ref}
            >
                {Children.map(children, (child, index) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(
                            child as React.ReactElement<ButtonToggleGroupItemProps>,
                            {
                                onClick: (
                                    e: React.MouseEvent<HTMLButtonElement>
                                ) => {
                                    setActiveIndex(index)
                                    child.props.onClick?.(e)
                                },
                                isActive: index === activeIndex,
                                fullWidth,
                            }
                        )
                    }
                })}
                <div
                    className={
                        'absolute left-0 top-0 z-0 rounded-lg bg-white transition-transform duration-[250ms] ease-in-out'
                    }
                    style={{
                        width: maskRect?.width ?? 0,
                        height: maskRect?.height,
                        transform: `translateX(${(maskRect?.width ?? 0) * activeIndex + 4 * activeIndex}px)`,
                    }}
                />
            </ul>
        </div>
    )
}

ButtonToggleGroup.Item = ButtonToggleGroupItem

export default ButtonToggleGroup
