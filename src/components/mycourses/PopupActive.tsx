import { ActiveIcon } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  activeCourse: () => void
  time?: number
}
const PopupActive = ({ open, setOpen, activeCourse, time = 60 }: IProps) => {
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
          You will have{' '}
        </span>
        <span className="text-base font-bold leading-normal text-primary">
          {time} {time > 1 ? 'days' : 'day'}
        </span>
        <span className="text-base font-normal leading-normal text-gray-800">
          {' '}
          from the activation date to study this course
        </span>
      </div>
    )
  }

  return (
    <SappModalV3
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
