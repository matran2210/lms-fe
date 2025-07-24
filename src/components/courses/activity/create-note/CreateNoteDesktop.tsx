import { CloseNone, SaveIcon } from '@assets/icons'
import ModalResizeable from '@components/base/modal/ModalResizeable'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import ButtonIcon from '@components/courses/buttons/ButtonIcon'
import { Control, UseFormHandleSubmit } from 'react-hook-form'
import { NoteFormData } from 'src/type/courses-3-level'

interface IProps {
  id?: string | number
  uuid: string | number
  content: string
  onSubmit: (data: any) => void
  onRemove: () => void
  control: Control<NoteFormData>
  handleSubmit: UseFormHandleSubmit<NoteFormData>
  loading: boolean
}

const CreateNoteDesktop = ({
  id,
  uuid,
  content,
  onSubmit,
  onRemove,
  control,
  handleSubmit,
  loading,
}: IProps) => {
  return (
    <ModalResizeable
      position="center left"
      width={412}
      height={350}
      header={
        <div className="modal-header overflow-hidden">
          <div className="flex justify-between rounded-sm bg-shade-text-100 px-4 py-3">
            <h4 className="text-sm font-semibold">New Note</h4>
            <div className="cursor-pointer" onClick={() => onRemove()}>
              <CloseNone />
            </div>
          </div>
        </div>
      }
      rootClassName="rounded-xl overflow-hidden border-gray-12"
    >
      <div className="relative h-full w-full">
        <div className="h-[calc(100%-30px)]">
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            className="not-resizer sapp-text-area h-[calc(100%-40px)] w-full whitespace-pre-wrap p-1 focus:shadow-0"
            defaultValue={content}
          />
        </div>
        <div className="absolute bottom-0 right-0 px-1 py-3">
          <ButtonIcon
            title="Save"
            className="flex-row-reverse gap-2 rounded-md bg-bw-13 px-4 py-2 text-sm text-white"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
          >
            <SaveIcon />
          </ButtonIcon>
        </div>
      </div>
    </ModalResizeable>
  )
}

export default CreateNoteDesktop
