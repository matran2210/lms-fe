import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { memo, useState } from 'react'

const PDFViewer = ({ file }: { file: string }) => {

  const [fileSize, setFileSize] = useState<number>(0)

  const docs = [
    { uri: file }, // Remote file
  ]

  const getFileSizeFromUrl = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const contentLength = response.headers.get('Content-Length');
      if (!contentLength) {
        throw new Error('Content-Length header not found');
      }
      const fileSizeInBytes = parseInt(contentLength, 10);
      return fileSizeInBytes;
    } catch (error) {
      return null;
    }
  };


  getFileSizeFromUrl(file).then((fileSize) => {
    if (fileSize !== null) {
      setFileSize(Number(fileSize / (1024 * 1024)).toFixed(2) as any)
    }
  });

  return (
    <>
      {
        Number(fileSize) < 50 ? (
          <DocViewer
            documents={docs}
            pluginRenderers={DocViewerRenderers}
            initialActiveDocument={docs[1]}
            config={{
              header: {
                disableHeader: true,
              },
            }}
          />
        ) : (
          <>
            <div className='flex justify-center mt-24 mb-2'>
              <img src='https://view.officeapps.live.com/op/en-US/error.png' />
            </div>
            <div className='text-center'>We're sorry, but for some reason we can't open this for you.</div>
            <div className='text-center'>
              <a href={file} target='_blank' className='text-blue-800 underline'>Download here</a>
            </div>
          </>
        )
      }
    </>
  )
}
export default memo(PDFViewer)
