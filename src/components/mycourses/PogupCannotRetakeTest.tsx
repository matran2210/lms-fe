import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  onCancel: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
}
const PopupCanNotRetakeTest = ({ open, onCancel, setOpen }: IProps) => {
  const onOk = () => {
    onCancel()
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      okButtonCaption="Back"
      onOk={onOk}
      handleCancel={() => setOpen(false)}
      showHeader={false}
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="medium"
      confirmOnclose={false}
      title={undefined}
      showCancelButton={false}
    >
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto mb-6">
        <AlertIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold flex justify-center">
        No Retake
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-1 2xl:mb-11">
        You cannot retake the test because you have already passed this course.
        Congratulations!
      </div>
    </SappModalV2>
  )
}

export default PopupCanNotRetakeTest
