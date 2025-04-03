import { AlertIcon, InfoIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
import { StatusRequestSchedule } from '@utils/constants/Teacher'
import React, { Dispatch, SetStateAction } from 'react'
import {
  InternalFieldName,
  FormState,
  FieldValues,
  FieldArrayPath,
  FieldArray,
  FieldName,
  Field,
  FieldRefs,
  FieldErrors,
  RegisterOptions,
  UseFormRegisterReturn,
  SubmitHandler,
  SubmitErrorHandler,
  FieldError,
  ErrorOption,
  useForm,
} from 'react-hook-form'
import {
  defaultOpenReasonModal,
  IOpenReasonModal,
  UpdateStatusParams,
} from './TableContainer'

interface IProps {
  open: IOpenReasonModal
  setOpen: React.Dispatch<React.SetStateAction<IOpenReasonModal>>
  setOpenSuccessModal: Dispatch<SetStateAction<boolean>>
  handleUpdateStatus: ({
    requestId,
    type,
    reason,
    callback,
  }: UpdateStatusParams) => Promise<void>
}
const ReasonModal = ({
  open,
  setOpen,
  setOpenSuccessModal,
  handleUpdateStatus,
}: IProps) => {
  const { control, getValues, reset } = useForm()
  const handleCancel = () => {
    reset({ request_reject_reason: '' })
    setOpen(defaultOpenReasonModal)
  }

  const handleSubmit = () => {
    if (open.requestId === undefined) return
    if (open.type === undefined) return
    handleUpdateStatus({
      requestId: open.requestId,
      type: open.type,
      reason: getValues('request_reject_reason'),
      callback: () => {
        setOpen(defaultOpenReasonModal)
        setOpenSuccessModal(true)
      },
    })
  }
  return (
    <SappModalV3
      open={open.open}
      handleCancel={handleCancel}
      onOk={handleSubmit}
      icon={<AlertIcon />}
      header={'Please enter a reason for denying this request!'}
      showCancelButton
      cancelButtonCaption={'Cancel'}
      okButtonCaption={'Submit'}
      footerButtonClassName="flex flex-row-reverse justify-center gap-4"
      okButtonClass="rounded-md"
      cancelButtonClass="bg-gray-4 hover:bg-gay-6 text-[#9CA3AF] !no-underline rounded-md px-4 py-2"
      buttonSize="medium"
      color="danger"
      headerClassName="!text-sm !font-normal"
    >
      <div>
        <HookFormTextField
          label="Reason"
          name={'request_reject_reason'}
          control={control}
          placeholder="Input Text"
          required
        />
      </div>
    </SappModalV3>
  )
}

export default ReasonModal
