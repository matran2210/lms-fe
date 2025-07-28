import FileViewer from '@components/base/fileViewer/FileViewer'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import { IPdfModal } from 'src/type/courses-3-level'

export default function PdfModal({
  open,
  title,
  width = 527,
  height = 705,
  minWidth,
  minHeight,
  dragHandleClassName,
  header,
  onClose,
  fileUrl,
  position = 'center',
}: IPdfModal) {
  if (!open) return null

  return (
    <ModalResizeable
      title={title}
      width={width}
      height={height}
      minWidth={minWidth}
      minHeight={minHeight}
      header={header}
      dragHandleClassName={dragHandleClassName}
      handleCloseScratchPad={onClose}
      position={position}
    >
      <div
        style={{ height: 'calc(100% - 40px' }}
        className="mb-2 cursor-pointer select-none text-right text-base font-semibold text-bw-1 hover:text-primary"
      >
        <FileViewer fileName={title} fileUrl={fileUrl} />
      </div>
    </ModalResizeable>
  )
}
