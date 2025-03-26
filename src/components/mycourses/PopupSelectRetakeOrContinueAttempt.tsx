import { AlertIcon, ClockIcon } from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { formatTime } from '@components/common/timer'
import { Dispatch, ReactNode, SetStateAction } from 'react'

interface IProps {
  open: boolean
  onCancel: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
  onOk: () => void
  remainingTimeLastAttempt: number
  title: ReactNode
}
const PopupSelectRetakeOrContinueAttempt = ({
  open,
  onCancel,
  setOpen,
  onOk,
  remainingTimeLastAttempt,
  title,
}: IProps) => {
  return (
    <SappModalV3
      open={open}
      okButtonCaption="Start"
      cancelButtonCaption={'Cancel'}
      onOk={() => {
        onOk()
        setOpen(false)
      }}
      handleCancel={() => {
        setOpen(false)
      }}
      footerButtonClassName="flex justify-between item-center"
      buttonSize="medium"
      title={title}
      icon={undefined}
      header=""
      content={
        'Your last attempt was unexpectedly ended. Do you want to continue from where you left off in the previous one?'
      }
    >
      <div>
        <div className={`relative pt-5 md:pt-9`}>{/* Select Option */}</div>
      </div>
    </SappModalV3>
  )
}

export default PopupSelectRetakeOrContinueAttempt
