import ShortCourseModal from '@components/modal/ShortCourseModal'
import { ActiveIcon } from '@lms/assets'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  activeCourse: () => void
}
const PopupActive = ({ open, setOpen, activeCourse }: IProps) => {
  const handleCancel = () => {
    setOpen(false)
  }
  const onOk = () => {
    setOpen(false)
    activeCourse()
  }

  const ContentActiveCourse = () => {
    return (
      <div className="justify-center self-stretch text-center">
        <span className="text-base font-normal leading-normal text-gray-800">
          Please select &apos;Confirm&apos; to start studying this course right
          away.
        </span>
      </div>
    )
  }

  return (
    <ShortCourseModal
      open={open}
      handleCancel={handleCancel}
      onOk={onOk}
      icon={<ActiveIcon />}
      header="Active Course?"
      content={<ContentActiveCourse />}
      showFooter
      okButtonCaption="Confirm"
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption="I will begin later"
      isUnderLine
    />
  )
}

export default PopupActive
