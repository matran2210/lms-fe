import React from 'react'
import { useAppDispatch } from 'src/redux/hook'
import Countdown from './Countdown'
import { IHeaderTestProps } from 'src/type/courses-3-level'
import { Close } from '../icons'
import { ButtonSecondary } from '@lms/ui'
import { disableUnsavedChange } from '@lms/contexts'

export default function HeaderTest({
  checkUnSubmitAnswer,
  handleSubmitQuestion,
  openLimit,
  quizDetail,
  setOpenQuit,
  setSubmitEventTest,
  setUnSubmitAnswer,
  timeRef,
  type,
  setOpenSubmit,
  submited,
}: IHeaderTestProps) {
  const dispatch = useAppDispatch()
  return (
    <div className="relative z-50 flex min-h-[76px] items-center justify-between gap-4 bg-white px-4 py-3 shadow-search lg:px-8">
      <span
        className="bg-gray-17 cursor-pointer overflow-hidden rounded-md p-2 text-bw-13"
        onClick={(e) => {
          e.preventDefault()
          setOpenQuit(true)
          dispatch(disableUnsavedChange())
          if (type === 'event-test') {
            setSubmitEventTest(true)
          }
        }}
      >
        <Close className="h-6 w-6" />
      </span>
      <div className="flex flex-col items-center gap-1">
        <div className="truncate text-base font-normal text-bw-13">
          {quizDetail?.name}
        </div>
        {quizDetail?.quiz_timed && (
          <Countdown
            remainTime={quizDetail?.quiz_timed}
            onTimeOut={() => {
              if (!openLimit) {
                dispatch(disableUnsavedChange())
                handleSubmitQuestion('timeout')
              }
            }}
            ref={timeRef}
          />
        )}
      </div>

      <div className="flex items-center justify-end">
        <ButtonSecondary
          title="Finish"
          size="small"
          loading={false}
          disabled={submited}
          onClick={() => {
            if (checkUnSubmitAnswer()?.length > 0) {
              setUnSubmitAnswer(true)
            } else {
              setOpenSubmit(true)
            }
            dispatch(disableUnsavedChange())
          }}
          className="!rounded-lg"
        />
      </div>
    </div>
  )
}
