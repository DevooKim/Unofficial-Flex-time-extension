export const isLatestVersion = (
    currentVersion: string,
    targetVersion: string
) => {
    const [currentMajor, currentMinor, currentPatch] = currentVersion
        .split('.')
        .map(Number)
    const [targetMajor, targetMinor, targetPatch] = targetVersion
        .split('.')
        .map(Number)

    if (currentMajor < targetMajor) return false
    if (currentMajor > targetMajor) return true

    if (currentMinor < targetMinor) return false
    if (currentMinor > targetMinor) return true

    if (currentPatch < targetPatch) return false
    if (currentPatch > targetPatch) return true
}
