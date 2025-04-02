import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
import dayjs from 'dayjs'
import React, { Dispatch, ForwardedRef, SetStateAction } from 'react'
import Countdown from 'src/pages/test/countdown'
import { useAppDispatch } from 'src/redux/hook'
import { disableUnsavedChange } from 'src/redux/slice/Login/Login'

interface IProps {
  quizDetail: {
    name: string
    quiz_timed?: number | null
    quiz_type: string
    is_limited: boolean
    limit_count: string
  }
  handleSubmitQuestions: (type_submit: 'timeout' | 'submit') => Promise<void>
  timeRef: ForwardedRef<any>
  quizAttempt: {
    id: string
    number_of_attempts: number
    is_limited: boolean
    created_at?: string
    quiz_timed?: number
  }
  setUnSubmitAnswer: Dispatch<SetStateAction<boolean>>
  checkUnSubmitAnswer: () => number[]
  setOpenQuit: Dispatch<SetStateAction<boolean>>
  setSubmitEventTest: Dispatch<SetStateAction<boolean>>
  type: string | string[] | undefined
  submited: boolean
  setOpenSubmit: Dispatch<SetStateAction<boolean>>
  onSubmitAnswer: (action?: string) => void
  handleTimeoutSubmit: () => void
}

const calculateRemainingTime = (
  createdAt: string | undefined,
  quizTimed: number,
): number => {
  const endTime = dayjs(createdAt).add(quizTimed, 'minutes')
  const now = dayjs()
  const diffInSeconds = endTime.diff(now, 'second')
  return Math.max(0, diffInSeconds) // Return 0 if time has expired
}

const HeaderTest = ({
  checkUnSubmitAnswer,
  quizAttempt,
  quizDetail,
  setOpenQuit,
  setSubmitEventTest,
  setUnSubmitAnswer,
  timeRef,
  type,
  setOpenSubmit,
  submited,
  onSubmitAnswer,
  handleTimeoutSubmit,
}: IProps) => {
  const dispatch = useAppDispatch()
  // const remainingTime = calculateRemainingTime(quizAttempt?.created_at, quizAttempt?.quiz_timed);
  // console.log(remainingTime)
  const remainingTimeinSeconds = quizDetail?.quiz_timed
    ? dayjs(
        dayjs(new Date(quizAttempt.created_at ?? '')).add(
          quizDetail?.quiz_timed,
          'minutes',
        ),
      ).diff(dayjs(), 'seconds')
    : null
  const remainingTimeAttempt =
    (remainingTimeinSeconds ?? 0) > 0 ? (remainingTimeinSeconds ?? 0) : 0
  return (
    <div className="relative z-50 flex items-center justify-between bg-gray-3 px-6 py-2">
      <div className="w-2/6 truncate text-[18px] font-medium">
        {quizDetail?.name}
      </div>
      {quizDetail?.quiz_timed && quizAttempt.created_at && (
        <Countdown
          remainTime={remainingTimeAttempt}
          onTimeOut={handleTimeoutSubmit}
          ref={timeRef}
        />
      )}

      <div className="flex w-2/6 items-center justify-end">
        {!['ENTRANCE_TEST', 'EVENT_TEST'].includes(quizDetail?.quiz_type) && (
          <div className="mr-6 text-medium-sm text-bw-1">
            Attempt: {quizAttempt?.number_of_attempts}
            {quizDetail?.is_limited ? `/${quizDetail?.limit_count}` : ''}
          </div>
        )}
        <ButtonCancelSubmit
          className={'flex flex-row-reverse gap-4'}
          submit={{
            title: 'Finish',
            size: 'small',
            loading: false,
            disabled: submited,
            className: 'border border-bw-1',
            color: 'secondary',
            onClick: () => {
              onSubmitAnswer('finish')
              if (checkUnSubmitAnswer()?.length > 0) {
                setUnSubmitAnswer(true)
              } else {
                setOpenSubmit(true)
              }
              dispatch(disableUnsavedChange())
            },
          }}
          cancel={{
            title: 'Quit',
            size: 'small',
            className: 'border border-bw-1 !w-[109px]',
            color: 'secondary',
            onClick: () => {
              setOpenQuit(true)
              dispatch(disableUnsavedChange())
              if (type === 'event-test') {
                setSubmitEventTest(true)
              }
            },
            loading: false,
            //   full: fullWidthBtn,
          }}
        ></ButtonCancelSubmit>
      </div>
    </div>
  )
}

export default HeaderTest
