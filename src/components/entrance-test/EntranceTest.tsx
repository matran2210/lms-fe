import React, { Dispatch, SetStateAction, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import { formatTime } from '@components/common/timer'
import EntrancePopup from './EntrancePopup'
import { useRouter } from 'next/router'
import SappButton from '@components/base/button/SappButton'
import PopupExtend from './PopupExtend'
import { trackGAEvent } from '@utils/google-analytics'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'

interface EntranceTestProps {
  data: any
  setOpen: Dispatch<SetStateAction<boolean>>
  open: boolean
}

enum EAttemptStatus {
  UN_SUBMITTED = 'UN_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  UN_FINISHED = 'UN_FINISHED',
}

const EntranceTest = ({ data, setOpen, open }: EntranceTestProps) => {
  const [openFillForn, setOpenFillForm] = useState(false)
  const router = useRouter()
  const handleOnClick = () => {
    if (data?.attempt_times >= 1) {
      router.push(`entrance-test/test-result/${data?.quiz_attempt_id}`)
      trackGAEvent('Click Button Result Entrance Test List')
    } else {
      setOpen(true)
      trackGAEvent('Click Button Begin Entrance Test List')
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
        <h2 className="mb-5 line-clamp-2 text-2xl font-medium text-bw-1">
          {data?.name}
        </h2>
      </div>
      <div className="mt-auto">
        <div className="info">
          <div className="flex justify-between border-b border-gray-2 pb-4 text-base capitalize text-gray-1">
            {data?.is_attempt ? (
              <>
                <p>Time taken:</p>
                <p className="font-medium text-bw-1">{timeTakenFormatted}</p>
              </>
            ) : (
              <>
                <p>Time allowed: </p>
                <p className="font-medium text-bw-1">{timeAllowFormatted}</p>
              </>
            )}
          </div>
          <div className="flex justify-between pt-4 text-base capitalize text-gray-1">
            <p>Results:</p>
            {data?.is_attempt ? (
              <>
                <p className="text-state-success">
                  {data?.total_correct_answer + '/' + data?.total_question}
                </p>
              </>
            ) : (
              <span className="">--</span>
            )}
          </div>
        </div>
        <div className="action relative mt-10 flex items-center justify-between">
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
                className="!p-0 font-medium underline"
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
      <PopUpRemindEntrance setOpenFillForm={setOpenFillForm} />
      <EntrancePopup
        open={open}
        setOpen={setOpen}
        entrancePopupContent={data}
        openFillForn={openFillForn}
        setOpenFillForm={setOpenFillForm}
      />
      <PopupExtend open={openExpired} setOpen={setOpenExpired} />
    </>
  )
}

export default EntranceTest
