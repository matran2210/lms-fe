import { CheckIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import React, { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}
const SuccessModal = ({ open, setOpen }: IProps) => {
  return (
    <SappModalV3
      open={open}
      icon={<CheckIcon />}
      header={'Your comment has been submitted successfully.'}
      showCancelButton
      showFooter={false}
      cancelButtonCaption={'Cancel'}
      okButtonCaption={'Submit'}
      footerButtonClassName="flex flex-row-reverse justify-center gap-4"
      okButtonClass="rounded-md"
      cancelButtonClass="bg-gray-4 hover:bg-gay-6 text-[#9CA3AF] !no-underline rounded-md px-4 py-2"
      buttonSize="medium"
      handleCancel={() => {
        setOpen(false)
      }}
      onOk={() => {
        setOpen(false)
      }}
      headerClassName="!text-sm !font-normal"
    ></SappModalV3>
  )
}

export default SuccessModal
