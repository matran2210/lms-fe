import { isPdfFile } from '@utils/helpers'
import React from 'react'
import { OFFICE_VIEWER_URL } from 'src/constants'

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
          src={`${OFFICE_VIEWER_URL}?src=${encodeURIComponent(fileUrl)}`}
          className="h-full w-full border-none"
        />
      )}
    </>
  )
}

export default FileViewer
