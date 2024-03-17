import {
    ElementProps,
    OffsetOptions,
    Placement,
    arrow,
    offset as offsetBase,
    useDelayGroup,
    useFloating as useFloatingBase,
    useFocus,
    useHover,
    useInteractions,
    useTransitionStyles,
} from '@floating-ui/react'
import { useRef, useState } from 'react'

type myFloatingType = {
    placement?: Placement
    offset?: OffsetOptions
    delay?:
        | number
        | Partial<{
              open: number
              close: number
          }>
}

const useMyFloating = ({
    placement = 'bottom',
    offset = 8,
    delay = 0,
}: myFloatingType) => {
    const [isOpen, setIsOpen] = useState(false)
    const arrowRef = useRef<SVGSVGElement>(null)

    const floating = useFloatingBase({
        open: isOpen,
        onOpenChange: setIsOpen,
        placement: placement,
        middleware: [
            arrow({
                element: arrowRef,
            }),
            offsetBase(offset),
        ],
    })

    useDelayGroup(floating.context, {
        id: floating.context.floatingId,
    })

    const floatingHover = useHover(floating.context, { delay })
    const floatingFocus = useFocus(floating.context)

    const getFloatingInteraction = (hooks: Array<ElementProps | void> = []) => {
        const floatingInteraction = useInteractions([
            floatingHover,
            floatingFocus,
            ...hooks,
        ])

        return floatingInteraction
    }

    const { styles } = useTransitionStyles(floating.context, {
        duration: 250,
        initial: {
            opacity: 0,
        },
    })

    if (delay) {
        floating.floatingStyles = { ...floating.floatingStyles, ...styles }
    }

    return {
        floating,
        getFloatingInteraction,
        arrowRef,
        isOpen,
    }
}

export default useMyFloating
