import ButtonCancelSubmit from '@components/base/button/ButtonCancelSubmit'
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
  openLimit: boolean
  handleSubmitQuestion: (type_submit: 'timeout' | 'submit') => Promise<void>
  timeRef: ForwardedRef<any>
  quizAttempId: {
    id: string
    number_of_attempts: number
    is_limited: boolean
  }
  setUnSubmitAnswer: Dispatch<SetStateAction<boolean>>
  checkUnSubmitAnswer: () => number[]
  setOpenQuit: Dispatch<SetStateAction<boolean>>
  setSubmitEventTest: Dispatch<SetStateAction<boolean>>
  type: string | string[] | undefined
  submited: boolean
  setOpenSubmit: Dispatch<SetStateAction<boolean>>
}

const HeaderTest = ({
  checkUnSubmitAnswer,
  handleSubmitQuestion,
  openLimit,
  quizAttempId,
  quizDetail,
  setOpenQuit,
  setSubmitEventTest,
  setUnSubmitAnswer,
  timeRef,
  type,
  setOpenSubmit,
  submited,
}: IProps) => {
  const dispatch = useAppDispatch()
  return (
    <div className="relative z-50 flex items-center justify-between bg-gray-3 px-6 py-2">
      <div className="w-2/6 truncate text-[18px] font-medium">
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

      <div className="flex w-2/6 items-center justify-end">
        {!['ENTRANCE_TEST', 'EVENT_TEST'].includes(quizDetail?.quiz_type) && (
          <div className="mr-6 text-medium-sm text-bw-1">
            Attempt: {quizAttempId?.number_of_attempts}
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
