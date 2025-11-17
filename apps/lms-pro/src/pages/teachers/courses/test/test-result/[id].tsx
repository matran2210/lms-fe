import { SappBreadCrumbs } from '@lms/ui'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { TEST_TYPE } from '@lms/core'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'
import { ITabs } from '@lms/core'
import TestResultPage from 'src/pages/courses/test/test-result/testResultPage'
import { GRADE_STATUS, TitleSidebar, PageLink } from '@lms/core'
import { UserType } from 'src/redux/types/User/urser'
import withAuthorization from 'src/HOC/withAuthorization'

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
      title: `${TEST_TYPE[questions?.quizAttempt?.quiz?.quiz_type]}`,
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
