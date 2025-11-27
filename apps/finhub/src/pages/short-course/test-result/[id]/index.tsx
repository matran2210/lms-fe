import Tooltip from '@components/common/Tooltip'
import Layout from '@components/layout'
import TestResultPage from '@components/v2/test-result/testResultPage'
import { CloseModalIcon, MenuDotsIcon } from '@lms/assets'
import { GRADE_STATUS } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { ButtonSecondary, ModalNotMobileFriendly } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ResultAPI } from 'src/pages/api/short-course/test-result'

const TestResultDetail = () => {
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [open, setOpen] = useState(false)
  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => ResultAPI.getQuizAttempts(router.query.id),
      router.query.id !== undefined,
      () => router.replace('/'),
    )
  }

  const useGetQuizAttemptsChart = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => ResultAPI.getQuizAttemptsChartData(router.query.id),
      router.query.id !== undefined,
    )
  }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: questions } = useGetQuizAttempts('quiz-attempts', {})
  const { data: chartData, isLoading: isLoadingChart } =
    useGetQuizAttemptsChart('quiz-attempts-chart', {})

  const quiz = questions?.quizAttempt?.quiz
  const isShowRetakeButton =
    !quiz?.limit_count ||
    (quiz?.is_limited &&
      questions?.quizAttempt?.number_of_attempts < quiz?.limit_count)
  let linkTest = `/short-course/test/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}&class_id=${questions?.class_id}`
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `/short-course/test-result/${router.query.id}`
  }

  const handleRetake = () => {
    localStorage.removeItem('quizAttempt')
    router.push(linkTest)
  }
  return (
    <div>
      <div className="fixed top-0 z-20 grid w-full grid-cols-[auto_1fr_auto] items-center bg-white p-4 shadow-[0_4px_16px_0_rgba(44,48,0,0.05)] md:px-8 md:py-2">
        <div
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-gray-200 transition-colors duration-300 hover:bg-gray-300"
          onClick={() => {
            router.push(`/short-course/detail/${questions?.class_id ?? ''}`)
          }}
        >
          <CloseModalIcon />
        </div>
        <div className="text-center text-xl font-bold">
          {questions?.quizAttempt?.quiz?.name}
        </div>
        <ButtonSecondary
          title="Retake"
          size="small"
          onClick={handleRetake}
          className={clsx('hidden md:block', { hidden: !isShowRetakeButton })}
        />
        <Tooltip
          placement="left"
          title={
            <span
              className="cursor-pointer text-sm"
              onClick={() => setOpen(true)}
            >
              Retake
            </span>
          }
          className={clsx('block md:hidden', { hidden: !isShowRetakeButton })}
        >
          <button className="text-icon">
            <MenuDotsIcon />
          </button>
        </Tooltip>
      </div>
      <Layout title="Test Result" showSidebar={false}>
        <div className="mx-auto mb-24 max-w-[1542px] md:mb-20 xl:mb-0">
          <TestResultPage
            questions={questions}
            type={questions?.course?.course_categories?.[0]?.name}
            chartData={chartData!}
            subjectCode={questions?.course?.subject?.code ?? ''}
            score={
              questions?.quizAttempt?.grading_status ===
              GRADE_STATUS.FINISHED_GRADING
                ? questions?.quizAttempt?.score
                : chartData?.multiple_choice_score
            }
            isLoadingChart={isLoadingChart}
          />
        </div>
      </Layout>
      {isMobileView && (
        <ModalNotMobileFriendly open={open} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

export default TestResultDetail
