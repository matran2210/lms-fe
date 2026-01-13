import { IPdfModal } from '@lms/core'
import { FileViewer, ModalResizeable } from '@lms/ui'

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
      className="!rounded-lg"
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
      <div className="h-full cursor-pointer select-none text-right text-base font-semibold text-bw-1 hover:text-primary">
        <FileViewer fileName={title} fileUrl={fileUrl} />
      </div>
    </ModalResizeable>
  )
}
