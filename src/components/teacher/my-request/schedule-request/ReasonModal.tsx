import { AlertIcon, InfoIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import HookFormTextArea from '@components/base/textfield/HookFormTextArea'
import HookFormTextField from '@components/base/textfield/HookFormTextField'
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

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setOpenSuccessModal: Dispatch<SetStateAction<boolean>>
}
const ReasonModal = ({ open, setOpen, setOpenSuccessModal }: IProps) => {
  const { control } = useForm()
  const handleCancel = () => {
    setOpen(false)
  }

  const handleSubmit = () => {
    setOpen(false)
    setOpenSuccessModal(true)
  }
  return (
    <SappModalV3
      open={open}
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
