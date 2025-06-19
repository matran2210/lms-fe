import RemainingTimeIcon from '@assets/icons/RemainingTimeIcon'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { Dispatch, ReactNode, SetStateAction } from 'react'

interface IProps {
  open: boolean
  handleContinue: () => Promise<void>
  setOpen: Dispatch<SetStateAction<boolean>>
  handleRetake: () => Promise<void>
  title: ReactNode
  time: ReactNode | null
}

const PopupSelectRetakeOrContinueAttempt = ({
  open,
  handleContinue,
  setOpen,
  handleRetake,
  title,
  time,
}: IProps) => {
  const handleOK = async (type: 'continue' | 'retake') => {
    if (type === 'continue') {
      await handleContinue()
    } else {
      await handleRetake()
    }
    setOpen(false)
  }

  if (!time) return null

  return (
    <SappModalV3
      open={open}
      okButtonCaption="Continue the previous attempt"
      cancelButtonCaption="Start a new attempt"
      onOk={() => handleOK('continue')}
      handleCancel={() => setOpen(false)}
      footerButtonClassName="flex flex-col w-full justify-center items-center gap-3"
      buttonSize="medium"
      header={title}
      icon={undefined}
      showFooter={false}
      classNameModal="sapp-modal sapp-modal__opt-continue-test"
      okButtonClass="w-full"
      cancelButtonClass="!px-0 w-full border rounded-lg border-[#404041] text-[#404041]"
      customFooter={
        <div className="flex w-full flex-col items-center justify-center gap-3">
          <ButtonPrimary
            title="Continue the previous attempt"
            size="medium"
            full
            onClick={() => handleOK('continue')}
          />
          <ButtonSecondary
            title="Start a new attempt"
            size="medium"
            full
            onClick={() => handleOK('retake')}
          />
        </div>
      }
    >
      <div className="text-center text-base text-gray-800">
        <div>Your last attempt was unexpectedly ended.</div>
        <div>Please click &apos;Continue&apos; to proceed with the test.</div>
      </div>
      <div className="flex justify-center gap-4 pb-10 pt-6">
        <div className="flex items-center gap-2 text-base font-semibold">
          <RemainingTimeIcon />
          Your remaining time:
        </div>
        {time}
      </div>
    </SappModalV3>
  )
}

export default PopupSelectRetakeOrContinueAttempt
