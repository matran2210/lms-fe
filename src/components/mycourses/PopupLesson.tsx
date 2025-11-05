import { ConfirmIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'

interface IProps {
  open: boolean
  setOpen: any
}
const PopupLesson = ({ open, setOpen }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  const ContentLesson = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          Please pass the Foundation Class to activate this course
        </span>
      </div>
    )
  }

  return (
    <SappModalV3
      open={open}
      handleCancel={onOk}
      onOk={onOk}
      icon={<ConfirmIcon />}
      header="Foundation Required"
      content={<ContentLesson />}
      showFooter
      okButtonCaption="Back to My Course"
      fullWidthBtn
      buttonSize="medium"
      showCancelButton={false}
      isUnderLine
    />
  )
}

export default PopupLesson
