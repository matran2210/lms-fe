import { isPdfFile } from '@utils/helpers'
import React from 'react'

const FileViewer = ({
  fileName,
  fileUrl,
}: {
  fileName: string
  fileUrl: string
}) => {
  return (
    <>
      {isPdfFile(fileName) ? (
        <iframe src={fileUrl} className="h-full w-full border-none" />
      ) : (
        <iframe
          src={`${process.env.NEXT_PUBLIC_OFFICE_VIEWER_URL}?src=${encodeURIComponent(fileUrl)}`}
          className="h-full w-full border-none"
        />
      )}
    </>
  )
}

export default FileViewer
