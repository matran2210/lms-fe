import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'
import SinglePageLayout from '@components/layout/SinglePage'
import { TEST_TYPE } from '@utils/constants'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'
import { ITabs } from 'src/type'
import TestResultPage from './testResultPage'
import FullScreenLayout from '@components/layout/FullScreenLayout'

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
      link: '/courses',
      title: 'Courses',
      disable: false,
    },
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
      <div className="px-10 xl:container">
        <Breadcrumb
          tabs={breadcrumbs}
          currentPage={'Results'}
          className="2xl-max:py-4"
        />
      </div>
      <div className="px-10 xl:container">
        <TestResultPage
          questions={questions}
          type={questions?.course?.course_categories?.[0]?.name}
          chartData={chartData}
          subjectCode={questions?.course?.subject?.code ?? ''}
        />
      </div>
    </FullScreenLayout>
  )
}

export default TestResultDetail
