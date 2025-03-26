import { AlertIcon, ClockIcon } from '@assets/icons'
import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { formatTime } from '@components/common/timer'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  onCancel: () => void
  setOpen: Dispatch<SetStateAction<boolean>>
  onOk: () => void
  remainingTimeLastAttempt: number
}
const PopupSelectRetakeOrContinueAttempt = ({
  open,
  onCancel,
  setOpen,
  onOk,
  remainingTimeLastAttempt,
}: IProps) => {
  return (
    <SappModalV2
      open={open}
      okButtonCaption="Continue the previous attempt"
      cancelButtonCaption={'Start a new attempt'}
      onOk={() => {
        onOk()
        setOpen(false)
      }}
      handleCancel={() => {
        setOpen(false)
      }}
      showFooter={false}
      footerButtonClassName="flex flex-row-reverse gap-8"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="medium"
      confirmOnclose={false}
      title={undefined}
    >
      <div>
        <div className="flex justify-center text-xl font-semibold text-bw-1 md:text-2xl">
          Your last attempt was unexpectedly ended. Do you want to continue from
          where you left off in the previous one?
        </div>

        <div className={`relative pt-5 md:pt-9`}>
          <div className={'flex justify-between gap-3'}>
            <div>
              <SappButton
                color={'primary'}
                title="Continue the previous attempt"
                onClick={onCancel}
                size="small"
              />
              {remainingTimeLastAttempt > 0 && (
                <div className="item-center flex gap-2 pt-2 font-semibold text-green-600">
                  <ClockIcon color={'#16a34a'} size={24} />
                  <span className="pt-[3px]">
                    {formatTime(remainingTimeLastAttempt)}
                  </span>
                </div>
              )}
            </div>

            <SappButton
              color={'text'}
              title={'Start a new attempt'}
              onClick={onOk}
              size="small"
            />
          </div>
        </div>
      </div>
    </SappModalV2>
  )
}

export default PopupSelectRetakeOrContinueAttempt
