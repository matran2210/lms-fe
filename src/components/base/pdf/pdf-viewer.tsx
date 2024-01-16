import { useState } from 'react'
// import default react-pdf entry
import { Document, Page, pdfjs } from 'react-pdf'
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

export default function PDFViewer({ file }: { file: string }) {
  //   const [file, setFile] = useState("https://cdn-dev.sapp.edu.vn/mail/1705050781607_sample.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=YR49Y7YONQ082E4HT8O6%2F20240115%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240115T125444Z&X-Amz-Expires=3600&X-Amz-Signature=334b6ab06c4b66daf48aca233f43c8144f5dd3b1568b41d1ba0f889087e4da2f&X-Amz-SignedHeaders=host&x-id=GetObject");
  const [numPages, setNumPages] = useState(null)

  function onDocumentLoadSuccess({ numPages: nextNumPages }: any) {
    setNumPages(nextNumPages)
  }

  return (
    <div>
      <div>
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from({ length: numPages as unknown as number }, (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          ))}
        </Document>
      </div>
    </div>
  )
}
