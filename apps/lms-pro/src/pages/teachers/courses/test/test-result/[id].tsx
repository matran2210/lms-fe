import { UserType } from '@lms/contexts'
import { GRADE_STATUS, ITabs, TEST_TYPE, TitleSidebar } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import { CoursesAPI } from 'src/pages/api/courses'
import TestResultPage from 'src/pages/courses/test/test-result/testResultPage'

const TestResultDetailTeacher = () => {
  const router = useRouter()

  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttempts(router.query.id),
      router.query.id !== undefined,
      () => router.replace(PageLink.TEACHER_MY_COURSE),
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

  let linkTest = `${PageLink.TEACHER_TEST}/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}`
  const quiz = questions?.quizAttempt?.quiz
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `${PageLink.TEACHER_MY_COURSE}/test/test-result/${router.query.id}`
  }

  const breadcrumbs: ITabs[] = [
    {
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${questions?.class_id ?? ''}`,
      title: `${questions?.course?.name ?? 'Course Detail'}`,
    },
    {
      link: linkTest,
      title: `${TEST_TYPE[questions?.quizAttempt?.quiz?.quiz_type as keyof typeof TEST_TYPE]}`,
    },
    {
      link: '#',
      title: TitleSidebar.RESULTS,
    },
  ]

  return (
    <FullScreenLayout title="Test Result" className="!bg-gray-3">
      <div className="mx-auto max-w-1570">
        <div className="py-5 xl:container md:px-10">
          <SappBreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="px-5 xl:container md:px-10">
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
            isTeacher
          />
        </div>
      </div>
    </FullScreenLayout>
  )
}

export default withAuthorization([UserType.TEACHER])(TestResultDetailTeacher)
