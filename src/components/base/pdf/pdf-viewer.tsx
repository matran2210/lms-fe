
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import { memo } from 'react'
const PDFViewer = ({ file }: { file: string }) => {
  const docs = [
    { uri: file }, // Remote file
  ]
  return (
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
  )
}
export default memo(PDFViewer)
