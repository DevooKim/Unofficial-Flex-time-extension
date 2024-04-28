export const isLatestVersion = (
    currentVersion: string, // v0.0.0
    targetVersion: string // v0.0.0
) => {
    return false
    const _currentVersion = currentVersion.replace('v', '')
    const _targetVersion = targetVersion.replace('v', '')

    const [currentMajor, currentMinor, currentPatch] = _currentVersion
        .split('.')
        .map(Number)
    const [targetMajor, targetMinor, targetPatch] = _targetVersion
        .split('.')
        .map(Number)

    if (currentMajor < targetMajor) return false
    if (currentMajor > targetMajor) return true

    if (currentMinor < targetMinor) return false
    if (currentMinor > targetMinor) return true

    if (currentPatch < targetPatch) return false
    if (currentPatch > targetPatch) return true
}
