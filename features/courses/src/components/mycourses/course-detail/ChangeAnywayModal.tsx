import { AlertTriagle } from '@lms/assets'
import { SappModalV3 } from '@lms/ui'
import {
  ExaminationsResponse,
  ExaminationForm,
} from 'src/redux/types/Course/MyCourse/ExamInformation'
import { UseFormReturn } from 'react-hook-form'

interface IProps {
  openConfirmModal: boolean
  setOpenConfirmModal: (open: boolean) => void
  methods: UseFormReturn<ExaminationForm>
  onSubmit: (data: ExaminationForm) => void
  isChangingLoad: boolean
  exams?: ExaminationsResponse
}
const ChangeAnywayModal = ({
  openConfirmModal,
  setOpenConfirmModal,
  methods,
  onSubmit,
  isChangingLoad,
  exams,
}: IProps) => {
  return (
    <SappModalV3
      open={openConfirmModal}
      cancelButtonCaption="No"
      okButtonCaption="Change Anyway"
      handleCancel={() => setOpenConfirmModal(false)}
      onOk={methods.handleSubmit(onSubmit, (errors) => {
        if (errors) {
          setOpenConfirmModal(false)
        }
      })}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<AlertTriagle />}
      header="Are you sure?"
      loading={isChangingLoad}
    >
      Your learning progress in the Revision class for the{' '}
      <span className="text-sm font-medium text-[#050505]">
        {exams?.current_exam_name}
      </span>{' '}
      exam cannot be saved. Do you want to continue making changes?
    </SappModalV3>
  )
}

export default ChangeAnywayModal
