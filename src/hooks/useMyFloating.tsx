import {
    ElementProps,
    OffsetOptions,
    Placement,
    arrow,
    offset as offsetBase,
    useFloating as useFloatingBase,
    useFocus,
    useHover,
    useInteractions,
} from '@floating-ui/react'
import { useRef, useState } from 'react'

type myFloatingType = {
    placement?: Placement
    offset?: OffsetOptions
    useClientPoint?: boolean
}

const useMyFloating = ({
    placement = 'bottom',
    offset = 8,
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

    const getFloatingInteraction = (hooks: Array<ElementProps | void>) => {
        const floatingHover = useHover(floating.context)
        const floatingFocus = useFocus(floating.context)
        const floatingInteraction = useInteractions([
            floatingHover,
            floatingFocus,
            ...hooks,
        ])

        return floatingInteraction
    }

    return {
        floating,
        getFloatingInteraction,
        arrowRef,
        isOpen,
    }
}

export default useMyFloating
