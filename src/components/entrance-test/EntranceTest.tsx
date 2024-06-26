import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import EntrancePopup from './EntrancePopup'
import { useRouter } from 'next/router'
import SappButton from '@components/base/button/SappButton'
import PopupExtend from './PopupExtend'

interface EntranceTestProps {
  data: any
}

enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
}

const EntranceTest = ({ data }: EntranceTestProps) => {
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const handleOnClick = () => {
    if (data?.attempt_times >= 1) {
      router.push(`entrance-test/test-result/${data?.quiz_attempt_id}`)
    } else {
      setOpen(true)
    }
  }

  const timeTakenFormatted = data?.total_attempt_time
    ? formatTime(data?.total_attempt_time)
    : 0
  const timeAllowFormatted = data?.quiz_timed
    ? formatTime(data?.quiz_timed * 60)
    : 'Unlimited'

  /**
   * @description state này để đóng mở popup nếu học viên làm 2 lần
   */
  const [openExpired, setOpenExpired] = useState(false)

  /**
   * @description Kiểm tra điều kiện có hiệu lực
   */
  const isAttemptValid =
    data.is_attempt &&
    [
      EAttemptStatus.SUBMITTED,
      EAttemptStatus.UN_FINISHED,
      EAttemptStatus.UN_SUBMITTED,
    ].includes(data?.attempt_status)

  return (
    <>
      <div className="name">
        <h2 className="text-2xl font-medium mb-5 text-bw-1 line-clamp-2">
          {data?.name}
        </h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between text-base text-gray-1 capitalize pb-4 border-b border-gray-2">
            {data?.is_attempt ? (
              <>
                <p>Time taken:</p>
                <p className="text-bw-1 font-medium">{timeTakenFormatted}</p>
              </>
            ) : (
              <>
                <p>Time allowed: </p>
                <p className="text-bw-1 font-medium">{timeAllowFormatted}</p>
              </>
            )}
          </div>
          <div className="flex justify-between text-base text-gray-1 capitalize pt-4">
            <p>Results:</p>
            {data?.is_attempt ? (
              <>
                <p className="text-state-success">
                  {data?.total_correct_answer + '/' + data?.total_question}
                </p>
              </>
            ) : (
              <span className="text-bw-1">--</span>
            )}
          </div>
        </div>
        <div className="action flex items-center justify-between relative mt-10">
          {isAttemptValid && (
            <ButtonSecondary
              title="Retake"
              size="small"
              full={false}
              onClick={() => setOpenExpired(true)}
            />
          )}
          {data.is_attempt ? (
            data.attempt_status === 'SUBMITTED' || 'UN_FINISHED' ? (
              <SappButton
                title="Result"
                onClick={handleOnClick}
                isUnderLine
                color="text"
                className="font-medium underline !p-0"
                size="small"
              />
            ) : (
              <></>
            )
          ) : (
            <ButtonSecondary
              title="Begin"
              full={false}
              size={'small'}
              className="ml-auto"
              onClick={handleOnClick}
            />
          )}
        </div>
      </div>
      <EntrancePopup
        open={open}
        setOpen={setOpen}
        entrancePopupContent={data}
      />
      <PopupExtend open={openExpired} setOpen={setOpenExpired} />
    </>
  )
}

export default EntranceTest
