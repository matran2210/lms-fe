import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
export default function PDFViewer({ file }: { file: string }) {
  const docs = [
    { uri: file }, // Remote file
  ]

  return (
    <DocViewer
      documents={docs}
      pluginRenderers={DocViewerRenderers}
      initialActiveDocument={docs[1]}
      style={{ height: 'calc(100vh - 104px' }}
      config={{
        pdfZoom: {
          zoomJump: 25,
          defaultZoom: 50,
        },
        header: { disableHeader: true },
      }}
    />
  )
}
