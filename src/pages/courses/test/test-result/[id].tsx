import { MenuDotsIcon, ShowMoreIcon } from '@assets/icons'
import CloseModalIcon from '@assets/icons/CloseModalIcon'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import ModalNotMobileFriendly from '@components/base/modal/ModalNotMobileFriendly'
import { TEST_TYPE } from '@utils/constants'
import { useGetDataQuery } from '@utils/index'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Tooltip from 'src/common/Tooltip'
import { GRADE_STATUS } from 'src/constants'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { CoursesAPI } from 'src/pages/api/courses'
import TestResultPage from 'src/pages/courses/test/test-result/testResultPage'
import { ITabs } from 'src/type'

const TestResultDetail = () => {
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [open, setOpen] = useState(false)
  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttempts(router.query.id),
      router.query.id !== undefined,
      () => router.replace('/courses'),
    )
  }

  const useGetQuizAttemptsChart = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttemptsChartData(router.query.id),
      router.query.id !== undefined,
    )
  }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: questions } = useGetQuizAttempts('quiz-attempts', {})

  // Sử dụng hook useGetQuestionTabs trong component
  const { data: chartData } = useGetQuizAttemptsChart('quiz-attempts-chart', {})

  const quiz = questions?.quizAttempt?.quiz
  const isShowRetakeButton =
    !quiz?.limit_count ||
    (quiz?.is_limited &&
      questions?.quizAttempt?.number_of_attempts < quiz?.limit_count)
  let linkTest = `/test/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}&class_id=${questions?.class_id}`
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `/courses/test/test-result/${router.query.id}`
  }

  const handleRetake = () => {
    localStorage.removeItem('quizAttempt')
    router.push(linkTest)
  }
  return (
    <div>
      <div className="sticky top-0 z-20 grid h-20 w-full grid-cols-[auto_1fr_auto] items-center bg-white p-4 shadow-[0_4px_16px_0_rgba(44,48,0,0.05)] md:px-8 md:py-3">
        <div
          className="grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-gray-200 transition-colors hover:bg-gray-300"
          onClick={() => {
            router.push(`/courses/my-course/${questions?.class_id ?? ''}`)
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
      <div className="container mx-auto mb-24 mt-6 max-w-[1542px] md:mb-20 xl:mb-0">
        <TestResultPage
          questions={questions}
          type={questions?.course?.course_categories?.[0]?.name}
          chartData={chartData}
          subjectCode={questions?.course?.subject?.code ?? ''}
          score={
            questions?.quizAttempt?.grading_status ===
            GRADE_STATUS.FINISHED_GRADING
              ? questions?.quizAttempt?.score
              : chartData?.multiple_choice_score
          }
        />
      </div>
      {isMobileView && (
        <ModalNotMobileFriendly open={open} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

export default TestResultDetail
