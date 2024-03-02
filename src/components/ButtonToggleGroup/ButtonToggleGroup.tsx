import React, { Children, useEffect, useRef, useState } from 'react'
import Button from '../Button'

type ButtonToggleGroupItemProps = React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> & {
    isActive?: boolean
    children?: React.ReactNode
    className?: string
}

type ButtonToggleGroupProps = {
    children: React.ReactNode
}

const ButtonToggleGroupItem = ({
    isActive,
    className,
    children,
    ...props
}: ButtonToggleGroupItemProps) => {
    const activeClassName = `hover:bg-white bg-white border-gray-300 text-gray-800`

    return (
        <li className="z-[1]">
            <Button
                className={`
            bg-transparent
            border-transparent
            tra
            rounded-lg
            text-gray-500
            transition-transform
            duration-[250ms] ease-in-out hover:bg-gray-600/[.16]
            ${isActive ? activeClassName : ''}
            ${className}`}
                {...props}
            >
                {children}
            </Button>
        </li>
    )
}

const ButtonToggleGroup = ({ children }: ButtonToggleGroupProps) => {
    const ref = useRef<HTMLUListElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)
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

    return (
        <div className="inline-flex rounded-[0.625rem] border bg-gray-100">
            <ul className="relative m-0.5 flex gap-1 p-0" ref={ref}>
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
                            }
                        )
                    }
                })}
                <div
                    className={
                        'absolute left-0 top-0 z-0 transform-gpu rounded-lg border bg-white transition-transform duration-[250ms] ease-in-out'
                    }
                    style={{
                        width: maskRect?.width ?? 0,
                        height: maskRect?.height,
                        transform: `translateX(${(maskRect?.width ?? 0) * activeIndex}px)`,
                    }}
                />
            </ul>
        </div>
    )
}

ButtonToggleGroup.Item = ButtonToggleGroupItem

export default ButtonToggleGroup
