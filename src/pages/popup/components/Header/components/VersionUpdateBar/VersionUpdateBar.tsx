import {
    FloatingPortal,
    autoPlacement,
    autoUpdate,
    offset,
    useClick,
    useFloating,
    useInteractions,
} from '@floating-ui/react'
import { useEffect, useState } from 'react'

import { useFetchLatestVersion } from '@src/pages/popup/hooks/queries/useFetchLatestVersion'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO

const VersionUpdateBar = () => {
    const latestVersion = useFetchLatestVersion()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(latestVersion.data && APP_VERSION !== latestVersion.data)
    }, [latestVersion.data, latestVersion.isFetching])

    const { refs, floatingStyles, context } = useFloating({
        open: isOpen,
        onOpenChange: setIsOpen,
        middleware: [autoPlacement(), offset(-20)],
        whileElementsMounted: autoUpdate,
    })

    const click = useClick(context)

    const { getReferenceProps, getFloatingProps } = useInteractions([click])

    const download = () => {
        window.open(
            `https://github.com/${OWNER}/${REPO}/releases/latest/download/${ASSET_NAME}`,
            '_blank'
        )
    }

    return (
        <div>
            <div ref={refs.setReference} />

            {isOpen && (
                <FloatingPortal>
                    <div
                        className="w-full h-5 bg-warning/[.32] border border-black flex justify-between items-center"
                        ref={refs.setFloating}
                        style={floatingStyles}
                        {...getFloatingProps()}
                    >
                        <span>새로운 버전이 있습니다!</span>
                        <div className="flex gap-2">
                            <button onClick={download}>다운로드</button>
                            <button onClick={() => setIsOpen(false)}>
                                닫기
                            </button>
                        </div>
                    </div>
                </FloatingPortal>
            )}
        </div>
    )
}

export default VersionUpdateBar
