import html2canvas from 'html2canvas'
import { useCallback } from 'react'
import useCopyToClipboard from './useCopyToClipboard'

type captureHandlerType = ({
    filename,
    mode,
}: {
    filename: string
    mode: 'clipboard' | 'download'
}) => void

const useCaptureHandler = ({
    id,
}: {
    id: string
}): {
    captureHandler: captureHandlerType
} => {
    const copy = useCopyToClipboard()

    const captureHandler: captureHandlerType = useCallback(
        ({ filename, mode }) => {
            const element = document.getElementById(id)
            if (!element) return

            html2canvas(element).then((canvas) => {
                if (mode === 'clipboard') {
                    canvas.toBlob((blob) => {
                        if (!blob) return

                        copy([new ClipboardItem({ [blob.type]: blob as Blob })])
                    })
                }

                if (mode === 'download') {
                    const link = document.createElement('a')
                    link.download = `${filename}.png`
                    link.href = canvas.toDataURL()
                    link.click()
                    // document.removeChild(link)
                    link.remove()
                }
            })
        },
        [id]
    )

    return { captureHandler }
}

export default useCaptureHandler
