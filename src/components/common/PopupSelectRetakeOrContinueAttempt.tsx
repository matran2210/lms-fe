import RemainingTimeIcon from '@assets/icons/RemainingTimeIcon'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { RadioChangeEvent } from 'antd'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

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
  const [value, setValue] = useState('continue')

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value)
  }

  const handleOK = async () => {
    switch (value) {
      case 'continue':
        await handleContinue().then(() => {
          setOpen(false)
        })

        break
      case 'retake':
        await handleRetake().then(() => {
          setOpen(false)
        })
      default:
        setOpen(false)
        break
    }
  }
  return (
    <SappModalV3
      open={open}
      okButtonCaption="Continue the previous attempt"
      cancelButtonCaption={'Start a new attempt'}
      onOk={handleOK}
      handleCancel={() => {
        setOpen(false)
      }}
      footerButtonClassName="flex flex-col w-full justify-center items-center gap-3"
      buttonSize="medium"
      header={title}
      icon={undefined}
      classNameModal={'sapp-modal sapp-modal__opt-continue-test'}
      okButtonClass="w-full"
      cancelButtonClass={
        '!px-0 w-full border rounded-lg border-gray-14 text-gray-14'
      }
    >
      <div className="text-center text-base text-bw-13">
        <div>Your last attempt was unexpectedly ended. </div>
        <div>Please click &apos;Continue&apos; to proceed with the test.</div>
      </div>
      {time && (
        <div className="flex justify-center gap-4 pt-6">
          <div className="flex items-center gap-2 text-base font-semibold">
            <RemainingTimeIcon />
            Your remaining time:
          </div>
          {time}
        </div>
      )}
    </SappModalV3>
  )
}

export default PopupSelectRetakeOrContinueAttempt
