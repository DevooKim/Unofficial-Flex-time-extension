import {
    OffsetOptions,
    Placement,
    arrow,
    offset as offsetBase,
    useDismiss,
    useFloating as useFloatingBase,
    useFocus,
    useHover,
    useInteractions,
    useRole,
} from '@floating-ui/react'
import { useRef, useState } from 'react'

type myFloatingType = {
    placement?: Placement
    offset?: OffsetOptions
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

    const floatingHover = useHover(floating.context)
    const floatingFocus = useFocus(floating.context)
    const floatingDismiss = useDismiss(floating.context)
    const floatingRole = useRole(floating.context, { role: 'tooltip' })
    const floatingInteraction = useInteractions([
        floatingHover,
        floatingFocus,
        floatingDismiss,
        floatingRole,
    ])

    return {
        floating,
        floatingInteraction,
        arrowRef,
        isOpen,
    }
}

export default useMyFloating
