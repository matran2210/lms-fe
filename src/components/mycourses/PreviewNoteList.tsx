import { CloseIconPreview } from '@assets/icons'

type IProps = {
  setOpen?: () => void
  title?: string
  content?: boolean
}

const PreviewNoteList = ({ setOpen, title, content }: IProps) => {
  return (
    <div className="absolute -bottom-2 right-full z-20 bg-white w-624px h-56 overflow-y-auto shadow-preview px-6 py-4 mr-4">
      <div className="flex items-start justify-between gap-1 mb-4">
        <div className="text-base text-bw-1 font-bold">{title}</div>
        <span className="text-gray-1 shrink-0 mt-0.5" onClick={setOpen}>
          <CloseIconPreview />
        </span>
      </div>

      <div className="text-base text-bw-1 font-normal">{content}</div>
    </div>
  )
}

export default PreviewNoteList
