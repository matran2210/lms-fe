import { SappModalV3 } from '@lms/ui'
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

        break
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
      footerButtonClassName="flex justify-between item-center mt-6"
      buttonSize="medium"
      title={title}
      icon={undefined}
      header=""
      classNameModal={'sapp-modal sapp-modal__opt-continue-test'}
      cancelButtonClass={'!px-0'}
    >
      <div>
        <div className="mt-10 text-center text-base text-gray">
          <div>Your last attempt was unexpectedly ended. </div>
          <div>
            Do you want to continue from where you left off in the previous one?
          </div>
        </div>
        <div className={`relative pt-5 md:pt-8`}>
          {/* Select Option */}
          <Radio.Group
            className="sapp-group-radio-wrapper flex flex-col gap-6"
            onChange={onChange}
            value={value}
            options={[
              {
                value: 'continue',
                label: (
                  <span className="text-base">
                    Continue the previous attempt
                  </span>
                ),
              },
              {
                value: 'retake',
                label: <span className="text-base">Start a new attempt</span>,
              },
            ]}
          />
        </div>
      </div>
    </SappModalV3>
  )
}

export default PopupSelectRetakeOrContinueAttempt
