"use client"
import { ITabs, TEST_TYPE_LABELS } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs, SappLoading } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useParams, useRouter } from 'next/navigation'
import { PageLink } from 'src/constants/routers'
import { CoursesAPI } from 'src/api/courses'
import TableQuestions from 'src/app/courses/quiz/your-answers-detail/TableQuestions'

const TestResultDetail = () => {
  const router = useRouter()
  const params = useParams();
  const { id } = params

  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttempts(id),
      id !== undefined,
      () => router.replace(PageLink.TEACHER_MY_COURSE),
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
    linkTest = `${PageLink.TEACHER_MY_COURSE}/test/test-result/${id}`
  }

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${questions?.class_id ?? ''}`,
      title: `${questions?.course?.name ?? 'Course Detail'}`,
    },
    {
      link: linkTest,
      title: `${TEST_TYPE_LABELS[questions?.quizAttempt?.quiz?.quiz_type as keyof typeof TEST_TYPE_LABELS] ?? ''}`,
    },
    {
      link: '#',
      title: 'Your Answer Details',
    },
  ]

  return (
    <FullScreenLayout title="Your Answer Details">
      <div className="mx-auto max-w-[1570px]">
        <div className="px-5 pt-5 xl:container md:px-10">
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
