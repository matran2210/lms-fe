import SappModalV3 from '@components/base/modal/SappModalV3'
import { Radio, RadioChangeEvent } from 'antd'
import { Dispatch, ReactNode, SetStateAction, useState } from 'react'

interface IProps {
  open: boolean
  handleContinue: () => Promise<void>
  setOpen: Dispatch<SetStateAction<boolean>>
  handleRetake: () => Promise<void>
  title: ReactNode
}
const PopupSelectRetakeOrContinueAttempt = ({
  open,
  handleContinue,
  setOpen,
  handleRetake,
  title,
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
      okButtonCaption="Continue"
      cancelButtonCaption={'Cancel'}
      onOk={handleOK}
      handleCancel={() => {
        setOpen(false)
      }}
      footerButtonClassName="flex justify-between item-center"
      buttonSize="medium"
      title={title}
      icon={undefined}
      header=""
    >
      <div>
        <div className="mb-11 mt-4 text-center text-medium-sm text-gray-1">
          Your last attempt was unexpectedly ended. Do you want to continue from
          where you left off in the previous one?
        </div>
        <div className={`relative pt-5 md:pt-9`}>
          {/* Select Option */}
          <Radio.Group
            className="sapp-group-radio-wrapper flex flex-col gap-5"
            onChange={onChange}
            value={value}
            options={[
              { value: 'continue', label: 'Continue the previous attempt' },
              { value: 'retake', label: 'Start a new attempt' },
            ]}
          />
        </div>
      </div>
    </SappModalV3>
  )
}

export default PopupSelectRetakeOrContinueAttempt
