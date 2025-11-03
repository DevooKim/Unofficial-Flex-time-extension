import semver from 'semver'

/**
 * 현재 버전이 타겟 버전보다 같거나 높은지 확인
 * @param currentVersion - 현재 버전 (예: "v1.0.0" 또는 "1.0.0")
 * @param targetVersion - 타겟 버전 (예: "v1.0.0" 또는 "1.0.0")
 * @returns 현재 버전이 타겟 버전보다 같거나 높으면 true
 */
export const isLatestVersion = (
    currentVersion: string,
    targetVersion: string
): boolean => {
    try {
        // semver.clean은 'v' 접두사를 자동으로 제거하고 정규화
        const cleanCurrent = semver.clean(currentVersion)
        const cleanTarget = semver.clean(targetVersion)

        if (!cleanCurrent || !cleanTarget) {
            console.warn(
                'Invalid version format:',
                currentVersion,
                targetVersion
            )
            return true // 버전 파싱 실패 시 업데이트 알림 표시 안 함
        }

        // 타겟 버전이 prerelease(alpha, beta, rc 등)인 경우 알림 표시 안 함
        if (semver.prerelease(cleanTarget)) {
            console.info(
                `Skipping prerelease version: ${targetVersion} (${cleanTarget})`
            )
            return true
        }

        // 현재 버전이 타겟 버전보다 같거나 높으면 true
        return semver.gte(cleanCurrent, cleanTarget)
    } catch (error) {
        console.error('Version comparison failed:', error)
        return true // 에러 시 업데이트 알림 표시 안 함
    }
}
