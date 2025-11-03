import { useEffect, useState } from 'react'

import { useFetchLatestVersion } from '@src/pages/popup/hooks/queries/useFetchLatestVersion'
import { isLatestVersion } from '@src/utils/checkVersion'

const OWNER = import.meta.env.VITE_GITHUB_OWNER
const REPO = import.meta.env.VITE_GITHUB_REPO

const VersionUpdateNotificationBar = () => {
    const { data, isLoading, isError, error } = useFetchLatestVersion()
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        if (data) {
            const needsUpdate = !isLatestVersion(APP_VERSION, data)
            setIsOpen(needsUpdate)

            if (needsUpdate) {
                console.info(
                    `New version available: ${data} (current: ${APP_VERSION})`
                )
            }
        }
    }, [data])

    // 에러 발생 시 조용히 실패 (사용자 경험 저해하지 않음)
    useEffect(() => {
        if (isError) {
            console.error('Failed to check for updates:', error)
        }
    }, [isError, error])

    const handleDownload = () => {
        window.open(
            `https://github.com/${OWNER}/${REPO}/releases/latest`,
            '_blank'
        )
    }

    const handleClose = () => {
        setIsOpen(false)
    }

    // 로딩 중이거나 에러 발생 시 아무것도 표시하지 않음
    if (isLoading || isError || !isOpen) {
        return null
    }

    return (
        <div className="flex h-5 w-full items-center justify-between border border-black bg-warning/[.32] px-2">
            <span className="text-xs font-medium">
                새로운 버전이 있습니다! ({APP_VERSION} → {data})
            </span>
            <div className="flex gap-2">
                <button
                    onClick={handleDownload}
                    className="text-xs font-semibold hover:underline"
                    aria-label={`버전 ${data} 다운로드`}
                >
                    다운로드
                </button>
                <button
                    onClick={handleClose}
                    className="text-xs hover:underline"
                    aria-label="알림 닫기"
                >
                    닫기
                </button>
            </div>
        </div>
    )
}

export default VersionUpdateNotificationBar
