import { CloseNone, SaveIcon } from '@lms/assets'
import { NoteFormData } from '@lms/core'
import { ButtonPrimary, HookFormTextArea, ModalResizeableNew } from '@lms/ui'
import { Control, UseFormHandleSubmit } from 'react-hook-form'

interface IProps {
  id?: string | number
  uuid: string | number
  content: string
  onSubmit: (data: any) => void
  onRemove: () => void
  control: Control<NoteFormData>
  handleSubmit: UseFormHandleSubmit<NoteFormData>
  loading: boolean
  isChanged: boolean
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
  isChanged,
}: IProps) => {
  return (
    <ModalResizeableNew
      position="center"
      width={412}
      height={350}
      header={({ requestClose }) => (
        <div className="modal-dragger modal-header cursor-move overflow-hidden">
          <div className="flex justify-between rounded-sm bg-gray-100 px-4 py-3">
            <h4 className="text-sm font-semibold">New Note</h4>
            <div className="cursor-pointer" onClick={() => requestClose()}>
              <CloseNone />
            </div>
          </div>
        </div>
      )}
      rootClassName="rounded-xl overflow-hidden border-gray"
    >
      <div className="relative h-[calc(100%-8px)] w-full">
        <div className="h-[calc(100%-54px)]">
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            className="not-resizer sapp-text-area h-full w-full whitespace-pre-wrap p-4 focus:shadow-0"
            defaultValue={content}
          />
        </div>
        {isChanged && (
          <div data-aos="fade-in" className="absolute bottom-4 right-4">
            <ButtonPrimary
              title="Save"
              className="font-semibold"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              startIcon={<SaveIcon />}
            />
          </div>
        )}
      </div>
    </ModalResizeableNew>
  )
}

export default CreateNoteDesktop
