"use client"
import TableQuestions from '@components/your-answers-detail/TableQuestions'
import { EYourAnswerType, ITabs, TEST_TYPE_LABELS } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs, SappLoading } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'

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

  // const useGetQuizAttemptsChart = (queryKey: string, params: Object) => {
  //   return useGetDataQuery(
  //     queryKey,
  //     params,
  //     () => CoursesAPI.getQuizAttemptsChartData(router.query.id),
  //     router.query.id !== undefined,
  //   )
  // }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: questions } = useGetQuizAttempts('quiz-attempts', {})
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
      title: `${TEST_TYPE_LABELS[questions?.quizAttempt?.quiz?.quiz_type as keyof typeof TEST_TYPE_LABELS]}`,
      disable: true,
    },
    {
      link: '/',
      title: 'Your Answer Details',
      disable: false,
    },
  ]

  return (
    <FullScreenLayout title="Your Answer Details" className="!bg-gray-4">
      <div className="mx-auto max-w-[1570px]">
        <div className="px-5 pt-5 xl:container md:px-10">
          <SappBreadCrumbs breadcrumbs={breadcrumbs} />
        </div>
        <div className="px-5 xl:container md:px-10">
          <>
            {!!questions?.course?.course_categories?.[0]?.name ? (
              <div>
                <div className="flex max-h-full flex-col overflow-y-auto">
                  <TableQuestions
                    className={'relative'}
                    type={EYourAnswerType.QUIZ}
                    gradingStatus={questions?.quizAttempt?.grading_status}
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
