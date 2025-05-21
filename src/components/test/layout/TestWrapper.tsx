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
import SappButtonIcon from '@components/base/button/SappButtonIcon'
import SAPPButtonV2 from '@components/base/button/SAPPButtonV2'

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
  timeRef: ForwardedRef<any>
  openLimit: boolean

  setOpenSubmit: Dispatch<SetStateAction<boolean>>
  handleSubmitQuestion: (type_submit: 'timeout' | 'submit') => Promise<void>
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
  openLimit,
  setOpenSubmit,
  handleSubmitQuestion,
  setOpenQuit,
  type,
  setSubmitEventTest,
  setUnSubmitAnswer,
  checkUnSubmitAnswer,
  footer,
}: PropsWithChildren<IProps>) => {
  const dispatch = useAppDispatch()

  return (
    <Layout>
      <Header
        className={clsx(
          'sticky top-0 z-10 flex w-full items-center bg-white px-8 py-3 shadow-sm ',
          headerClass,
        )}
      >
        <div className="flex w-full items-center justify-between">
          <div
            className="cursor-pointer rounded bg-gray-99 p-2"
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

          <div>
            <div className=" truncate text-base">{quizDetail?.name}</div>
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
          <div>
            <SAPPButtonV2
              title="Finish"
              type="text"
              color="secondary"
              className="rounded-lg border border-bw-1 bg-white px-4 py-2 text-sm !text-black"
              onClick={() => {
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
      <Content className={clsx('p-0', contentClass)}>{children}</Content>
      <Footer className={clsx('p-0', footerClass)}>{footer}</Footer>
    </Layout>
  )
}

export default TestWrapper
