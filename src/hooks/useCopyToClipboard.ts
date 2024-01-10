type CopyFn = (data: string | ClipboardItems) => Promise<boolean> // Return success

const useCopyToClipboard = (): CopyFn => {
    const copy: CopyFn = async (data) => {
        if (!navigator?.clipboard) {
            console.warn('Clipboard not supported')
            return false
        }

        try {
            if (typeof data === 'string') {
                await navigator.clipboard.writeText(data)
            }

            if (data[0] instanceof ClipboardItem) {
                await navigator.clipboard.write(data as ClipboardItems)
            }
            return true
        } catch (error) {
            console.warn('Copy failed', error)
            return false
        }
    }

    return copy
}

export default useCopyToClipboard
