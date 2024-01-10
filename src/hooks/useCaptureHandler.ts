import html2canvas from 'html2canvas'
import { useCallback } from 'react'

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
    const captureHandler: captureHandlerType = useCallback(
        // ({ filename }: { filename: string }): void => {
        ({ filename, mode }) => {
            const element = document.getElementById(id)
            if (!element) return

            html2canvas(element).then((canvas) => {
                // document.body.appendChild(canvas);

                //canvas를 clipboard에 저장
                if (mode === 'clipboard') {
                    canvas.toBlob((blob) => {
                        if (!blob) return

                        navigator.clipboard.write([
                            new ClipboardItem({ [blob.type]: blob as Blob }),
                        ])
                    })
                }

                if (mode === 'download') {
                    const link = document.createElement('a')
                    link.download = `${filename}.png`
                    link.href = canvas.toDataURL()
                    link.click()
                    document.removeChild(link)
                }
            })
        },
        [id]
    )

    return { captureHandler }
}

export default useCaptureHandler
