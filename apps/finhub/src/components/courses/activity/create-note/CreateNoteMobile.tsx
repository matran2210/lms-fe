import { CloseNone, SaveIcon } from '@lms/assets'
import BaseModal from '@components/courses/popup/BaseModal'
import { Control, UseFormHandleSubmit } from 'react-hook-form'
import { NoteFormData } from 'src/type/courses-3-level'
import { ButtonPrimary, HookFormTextArea } from '@lms/ui'

interface IProps {
  id?: string | number
  uuid: string | number
  content: string
  onSubmit: (data: any) => void
  onRemove: () => void
  control: Control<NoteFormData>
  handleSubmit: UseFormHandleSubmit<NoteFormData>
  loading: boolean
  visible: boolean
}

export default function CreateNoteMobile({
  id,
  uuid,
  content,
  onSubmit,
  onRemove,
  control,
  handleSubmit,
  loading,
  visible,
}: IProps) {
  return (
    <BaseModal
      title={
        <div className="relative p-4">
          <div className="absolute -left-4 -right-4 -top-4 bottom-0 overflow-hidden">
            <div className="flex justify-between rounded-sm bg-gray-100 px-4 py-3">
              <h4 className="text-sm font-semibold">New Note</h4>
              <div className="cursor-pointer" onClick={() => onRemove()}>
                <CloseNone />
              </div>
            </div>
          </div>
        </div>
      }
      visible={visible}
      onClose={() => onRemove()}
      width={'auto'}
      bodyStyle={{
        maxHeight: '65vh',
        overflowY: 'auto',
      }}
      wrapClassName="add-note-modal"
      closable={false}
    >
      <div className="relative h-full w-full">
        <div className="h-72">
          <HookFormTextArea
            placeholder="Take a note..."
            control={control}
            name={`description_${id ? id : uuid}`}
            className="not-resizer sapp-text-area h-[calc(100%-40px)] w-full whitespace-pre-wrap p-1 focus:shadow-0"
            defaultValue={content}
          />
        </div>
        <div className="absolute bottom-0 right-0">
          <ButtonPrimary
            title="Save"
            className="font-semibold"
            onClick={handleSubmit(onSubmit)}
            loading={loading}
            startIcon={<SaveIcon />}
          />
        </div>
      </div>
    </BaseModal>
  )
}
