import { CheckIcon } from '@lms/assets'
import { SappModalV3 } from '@lms/ui'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
const SuccessModal = ({ open, setOpen }: IProps) => {
  return (
    <SappModalV3
      handleClose={() => setOpen(false)}
      open={open}
      icon={<CheckIcon />}
      header={'Your comment has been submitted successfully.'}
      showCancelButton
      showFooter={false}
      cancelButtonCaption={'Cancel'}
      okButtonCaption={'Submit'}
      footerButtonClassName="flex flex-row-reverse justify-center gap-4"
      okButtonClass="rounded-md"
      cancelButtonClass="bg-gray-100 hover:bg-gay-6 text-gray-300 !no-underline rounded-md px-4 py-2"
      buttonSize="medium"
      handleCancel={() => {
        setOpen(false)
      }}
      onOk={() => {
        setOpen(false)
      }}
      headerClassName="!text-sm !font-normal"
      classNameModal={`sapp-custom-modal success-modal`}
    ></SappModalV3>
  )
}

export default SuccessModal
