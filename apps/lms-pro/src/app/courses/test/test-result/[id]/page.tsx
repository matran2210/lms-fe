"use client"
import { CloseModalIcon, MenuDotsIcon } from '@lms/assets'
import { ButtonSecondary } from '@lms/ui'

import { GRADE_STATUS } from '@lms/core'
import { SappLoading, Tooltip } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import clsx from 'clsx'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'
import TestResultPage from '../testResultPage'

const TestResultDetail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
      const params = useParams()
      const {id} = params
        const query = Object.fromEntries(searchParams.entries())
  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
        () => CoursesAPI.getQuizAttempts(id),
      id !== undefined,
      () => router.replace('/courses'),
    )
  }

  const useGetQuizAttemptsChart = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttemptsChartData(id),
      id !== undefined,
    )
  }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: questions, isLoading: loadingAttempt } = useGetQuizAttempts(
    'quiz-attempts',
    {},
  )

  // Sử dụng hook useGetQuestionTabs trong component
  const { data: chartData, isLoading: loadingChart } = useGetQuizAttemptsChart(
    'quiz-attempts-chart',
    {},
  )

  const { hasCertificate } = query

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
      linkTest = `/courses/test/test-result/${params.id}`
  }

  const handleRetake = () => {
    localStorage.removeItem('quizAttempt')
    router.push(linkTest)
  }

  return (
    <>
      {loadingChart ? (
        <SappLoading />
      ) : (
        <div>
          <div className="sticky top-0 z-20 grid w-full grid-cols-[auto_1fr_auto] items-center bg-white p-4 shadow-[0_4px_16px_0_rgba(44,48,0,0.05)] md:px-8 md:py-2">
            <div
              className="grid h-10 w-10 cursor-pointer place-items-center rounded-md bg-gray-200 transition-colors duration-300 hover:bg-gray-300"
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
              className={clsx('hidden md:block', {
                '!hidden': !isShowRetakeButton || hasCertificate,
              })}
            />
            <Tooltip
              placement="left"
              title={
                <span className="cursor-pointer text-sm" onClick={handleRetake}>
                  Retake
                </span>
              }
              rootClassName="my-retake-tooltip"
              className={clsx('block md:hidden', {
                hidden: !isShowRetakeButton || hasCertificate,
              })}
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
              loadingChart={loadingChart}
              loadingAttempt={loadingAttempt}
            />
          </div>
          {/* {isMobileView && (
            <ModalNotMobileFriendly
              open={open}
              onClose={() => setOpen(false)}
            />
          )} */}
        </div>
      )}
    </>
  )
}

export default TestResultDetail
