import { CloseIconPreview } from '@assets/icons'

type IProps = {
  setOpen?: () => void
  title?: string
  content?: boolean
}

const PreviewNoteList = ({ setOpen, title, content }: IProps) => {
  return (
    <div className=" right-full z-20 h-56 w-624px overflow-y-auto bg-white px-6 py-4 shadow-preview">
      <div className="mb-4 flex items-start justify-between gap-1">
        <div className="text-base font-bold text-bw-1">{title}</div>
        <span className="mt-0.5 shrink-0 text-gray-1" onClick={setOpen}>
          <CloseIconPreview />
        </span>
      </div>

      <div className="text-base font-normal text-bw-1">{content}</div>
    </div>
  )
}

export default PreviewNoteList
