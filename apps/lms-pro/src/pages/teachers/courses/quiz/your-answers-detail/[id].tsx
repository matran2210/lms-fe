import { ITabs, TEST_TYPE } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs, SappLoading } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useRouter } from 'next/router'
import { PageLink } from 'src/constants/routers'
import { CoursesAPI } from 'src/pages/api/courses'
import TableQuestions from 'src/pages/courses/quiz/your-answers-detail/TableQuestions'

const TestResultDetail = () => {
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
  let linkTest = `${PageLink.TEACHER_TEST}/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}`
  const quiz = questions?.quizAttempt?.quiz
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `${PageLink.TEACHER_MY_COURSE}/test/test-result/${router.query.id}`
  }

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${questions?.class_id ?? ''}`,
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
      title: 'Your Answer Details',
      disable: false,
    },
  ]

  return (
    <FullScreenLayout title="Your Answer Details">
      <div className="mx-auto max-w-1570">
        <div className="mt-5 px-5 xl:container md:px-10">
          <SappBreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="px-4 xl:container md:px-8">
          <>
            {!!questions?.course?.course_categories?.[0]?.name ? (
              <div>
                <div className="flex max-h-full flex-col">
                  <TableQuestions
                    className={'relative'}
                    type={questions?.course?.course_categories?.[0]?.name}
                    gradingStatus={questions?.quizAttempt?.grading_status}
                    isTeacher
                  />
                </div>
              </div>
            ) : (
              <SappLoading />
            )}
          </>
        </div>
      </div>
    </FullScreenLayout>
  )
}

export default TestResultDetail
