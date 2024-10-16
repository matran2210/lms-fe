import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { TEST_TYPE } from '@utils/constants'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'
import { ITabs } from 'src/type'
import TestResultPage from './testResultPage'

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
    <FullScreenLayout title="Test Result" className="!bg-gray-3">
      <div className="mx-auto max-w-[1570px]">
        <div className="px-5 xl:container md:px-10">
          <Breadcrumb
            tabs={breadcrumbs}
            currentPage={'Results'}
            className="2xl-max:py-4"
          />
        </div>
        <div className="px-5 xl:container md:px-10">
          <TestResultPage
            questions={questions}
            type={questions?.course?.course_categories?.[0]?.name}
            chartData={chartData}
            subjectCode={questions?.course?.subject?.code ?? ''}
          />
        </div>
      </div>
    </FullScreenLayout>
  )
}

export default TestResultDetail
