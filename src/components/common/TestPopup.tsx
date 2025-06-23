import RemainingTimeIcon from '@assets/icons/RemainingTimeIcon'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { TimeOutIcon } from '@components/icons'
import { formatTime } from '@utils/common'
import clsx from 'clsx'
import { Dayjs } from 'dayjs'
import { Dispatch, ReactNode, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: ReactNode
  time: string | Dayjs | Date
  numberOfAttempt?: number
  customFooter?: ReactNode
  otherContent?: ReactNode
}

const TestPopup = ({
  open,
  title,
  time,
  numberOfAttempt = 1,
  customFooter,
  otherContent,
  setOpen,
}: IProps) => {
  const timeFormated = formatTime(time, 'HH:mm:ss')
  const isTimeOut = timeFormated === '00:00:00'
  const isFinalAttempt = numberOfAttempt <= 1 // Số lần làm bài test còn lại là 1
  const isFinalAttemptTimeout = isTimeOut && isFinalAttempt // Hết thời gian làm bài test và chỉ còn 1 lần làm bài test

  return (
    <SappModalV3
      open={open}
      isClosable={true}
      onOk={() => {}}
      handleCancel={() => setOpen(false)}
      icon={isTimeOut ? <TimeOutIcon /> : undefined}
      header={title}
      showFooter={false}
      customFooter={customFooter}
    >
      {otherContent ? (
        <div className="pb-10">{otherContent}</div>
      ) : (
        <div className="text-center text-base font-normal text-gray-800">
          <div className="pb-6">
            {isFinalAttemptTimeout ? (
              <div>
                The test has timed out and has been submitted automatically.
              </div>
            ) : (
              <>
                <div>Your last attempt was unexpectedly ended. </div>
                <div>
                  Please click &apos;Continue&apos; to proceed with the test.
                </div>
              </>
            )}
          </div>
          {time && (
            <div className="flex justify-center gap-4 pb-10">
              <div className="flex items-center gap-2 text-base font-semibold">
                <RemainingTimeIcon />
                Your remaining time:
              </div>
              <div
                className={clsx(`text-base font-bold`, {
                  'text-info': !isTimeOut,
                  'text-error': isTimeOut,
                })}
              >
                <>{timeFormated}</>
              </div>
            </div>
          )}
        </div>
      )}
    </SappModalV3>
  )
}

export default TestPopup
