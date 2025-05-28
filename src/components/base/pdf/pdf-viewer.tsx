/* eslint-disable */
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { memo, useEffect, useState } from 'react'
import '@cyntler/react-doc-viewer/dist/index.css'

const PDFViewer = ({ file }: { file: string }) => {
  const [fileSize, setFileSize] = useState<number>(0)

  const docs = [{ uri: file }]

  const getFileSizeFromUrl = async (url: string) => {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const contentLength = response.headers.get('Content-Length')
      if (!contentLength) {
        throw new Error('Content-Length header not found')
      }
      const fileSizeInBytes = parseInt(contentLength, 10)
      return fileSizeInBytes
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    getFileSizeFromUrl(file).then((fileSize) => {
      if (fileSize !== null) {
        setFileSize(Number(fileSize / (1024 * 1024)).toFixed(2) as any)
      }
    })
  }, [file])

  return (
    <>
      {Number(fileSize) < 50 ? (
        <DocViewer
          documents={docs}
          pluginRenderers={DocViewerRenderers}
          initialActiveDocument={docs[1]}
          config={{
            header: {
              disableHeader: true,
            },
            pdfVerticalScrollByDefault: true,
          }}
          className="pdf-viewer-container"
        />
      ) : (
        <>
          <div className="mb-2 mt-24 flex justify-center">
            <img src="https://view.officeapps.live.com/op/en-US/error.png" />
          </div>
          <div className="text-center">
            We're sorry, but for some reason we can't open this for you.
          </div>
          <div className="text-center">
            <a href={file} target="_blank" className="text-blue-800 underline">
              Download here
            </a>
          </div>
        </>
      )}
    </>
  )
}
export default memo(PDFViewer)
