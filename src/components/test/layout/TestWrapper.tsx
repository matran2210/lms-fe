import React, {
  Dispatch,
  ForwardedRef,
  PropsWithChildren,
  SetStateAction,
} from 'react'
import { Layout } from 'antd'
import clsx from 'clsx'
import Icon from '@components/icons'
import Countdown from '@pages/test/countdown'
import { useAppDispatch } from 'src/redux/hook'
import { disableUnsavedChange } from 'src/redux/slice/Login/Login'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'
import dayjs from 'dayjs'

const { Header, Content, Footer } = Layout

interface IProps {
  headerClass?: string
  contentClass?: string
  footerClass?: string
  quizDetail: {
    name: string
    quiz_timed?: number | null
    quiz_type: string
    is_limited: boolean
    limit_count: string
  }
  quizAttempt: {
    id: string
    number_of_attempts: number
    is_limited: boolean
    created_at?: string
    quiz_timed?: number
  }
  timeRef: ForwardedRef<any>
  setOpenSubmit: Dispatch<SetStateAction<boolean>>
  handleTimeoutSubmit: () => void
  onSubmitAnswer: (action?: string) => void
  setOpenQuit: Dispatch<SetStateAction<boolean>>
  type: string | string[] | undefined
  setSubmitEventTest: Dispatch<SetStateAction<boolean>>
  setUnSubmitAnswer: Dispatch<SetStateAction<boolean>>
  checkUnSubmitAnswer: () => number[]
  footer?: React.ReactNode
}
const TestWrapper = ({
  children,
  headerClass,
  contentClass,
  footerClass,
  quizDetail,
  timeRef,
  setOpenSubmit,
  setOpenQuit,
  type,
  setSubmitEventTest,
  setUnSubmitAnswer,
  checkUnSubmitAnswer,
  footer,
  quizAttempt,
  handleTimeoutSubmit,
  onSubmitAnswer,
}: PropsWithChildren<IProps>) => {
  const dispatch = useAppDispatch()
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
    <Layout className="flex h-screen flex-col">
      <Header
        className={clsx(
          'sticky top-0 z-10 flex w-full items-center bg-white px-8 py-3 shadow-sm',
          headerClass,
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div
            className="cursor-pointer rounded bg-ink-200 p-2"
            onClick={() => {
              setOpenQuit(true)
              dispatch(disableUnsavedChange())
              if (type === 'event-test') {
                setSubmitEventTest(true)
              }
            }}
          >
            <Icon type="close" />
          </div>

          <div className="max-w-[448px]">
            <div className="truncate text-center text-base">
              {quizDetail?.name}
            </div>
            {quizDetail?.quiz_timed && (
              <Countdown
                remainTime={remainingTimeAttempt}
                onTimeOut={handleTimeoutSubmit}
                ref={timeRef}
              />
            )}
          </div>
          <div>
            <SAPPButtonV2
              title="Finish"
              type="text"
              color="secondary"
              className="rounded-lg border border-[#050505] bg-white px-4 py-2 text-sm !text-black"
              onClick={() => {
                onSubmitAnswer('finish')
                if (checkUnSubmitAnswer()?.length > 0) {
                  setUnSubmitAnswer(true)
                } else {
                  setOpenSubmit(true)
                }
                dispatch(disableUnsavedChange())
              }}
            />
          </div>
        </div>
      </Header>
      <Content className={clsx('flex-grow overflow-auto p-0', contentClass)}>
        {children}
      </Content>
      <Footer
        className={clsx(
          'shadow-t-sm relative w-full border-t border-ink-300 bg-white p-0',
          footerClass,
          'h-auto',
        )}
      >
        {footer}
      </Footer>
    </Layout>
  )
}

export default TestWrapper
