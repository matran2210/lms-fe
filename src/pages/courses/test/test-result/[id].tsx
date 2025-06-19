import CloseModalIcon from '@assets/icons/CloseModalIcon'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Container from '@components/Container'
import { TEST_TYPE } from '@utils/constants'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { GRADE_STATUS } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import TestResultPage from 'src/pages/courses/test/test-result/testResultPage'
import { ITabs } from 'src/type'

const TestResultDetail = () => {
  const router = useRouter()

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

  let linkTest = `/test/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}`
  const quiz = questions?.quizAttempt?.quiz
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `/courses/test/test-result/${router.query.id}`
  }

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: `/courses/my-course/${questions?.class_id ?? ''}`,
      title: `${questions?.course?.name ?? 'Course Detail'}`,
      disable: false,
    },
    {
      link: linkTest,
      title: `${TEST_TYPE[questions?.quizAttempt?.quiz?.quiz_type]}`,
      disable: true,
    },
    {
      link: '/',
      title: 'Results',
      disable: false,
    },
  ]

  return (
    <div>
      <div className="sticky top-0 z-20 grid h-20 w-full grid-cols-[auto_1fr_auto] items-center bg-white px-8 py-3 shadow-[0_4px_16px_0_rgba(44,48,0,0.05)]">
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
        <ButtonSecondary title="Retake" size="small" />
      </div>
      <div className="mx-auto mt-6 max-w-[1542px]">
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
    </div>
  )
}

export default TestResultDetail
