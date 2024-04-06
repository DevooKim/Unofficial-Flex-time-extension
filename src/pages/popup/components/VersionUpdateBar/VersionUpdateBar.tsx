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

    const download = () => {
        window.open(
            `https://github.com/${OWNER}/${REPO}/releases/latest/download/${ASSET_NAME}`,
            '_blank'
        )
    }

    return (
        <>
            {isOpen && (
                <div className="w-full h-5 bg-warning/[.32] border border-black flex justify-between items-center">
                    <span>새로운 버전이 있습니다! - {latestVersion.data}</span>
                    <div className="flex gap-2">
                        <button onClick={download}>다운로드</button>
                        <button onClick={() => setIsOpen(false)}>닫기</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default VersionUpdateBar
