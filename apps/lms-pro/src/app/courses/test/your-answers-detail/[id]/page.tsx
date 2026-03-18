'use client'
import SappLoading from '@components/common/SappLoading'
import { GRADE_STATUS, ITabs, TEST_TYPE_LABELS } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'
import TableQuestions from 'src/app/courses/quiz/your-answers-detail/TableQuestions'

const TestResultDetail = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const { id } = params
  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttempts(id),
      id !== undefined,
      () => router.replace('/courses'),
    )
  }

  // Sử dụng hook useGetQuizDetail trong component
  const { data: questions } = useGetQuizAttempts('quiz-attempts', {})

  let linkTest = `/test/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}`
  const quiz = questions?.quizAttempt?.quiz
  if (
    quiz?.is_limited &&
    quiz?.limit_count === questions?.quizAttempt?.number_of_attempts
  ) {
    // Nếu bài test đã quá số lần làm bài thì chỉ cho link đến trang kết quả, không cho làm lại
    linkTest = `/courses/test/test-result/${id}`
  }

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: `/courses/my-course/${questions?.class_id ?? ''}`,
      title: `${questions?.course?.name ?? 'Course Detail'}`,
      disable: false,
    },
    {
      link:
        questions?.quizAttempt?.grading_status === GRADE_STATUS.AWAITING_GRADING
          ? '#'
          : linkTest,
      title: `${TEST_TYPE_LABELS[questions?.quizAttempt?.quiz?.quiz_type as keyof typeof TEST_TYPE_LABELS]}`,
      disable:
        questions?.quizAttempt?.grading_status ===
        GRADE_STATUS.AWAITING_GRADING,
    },
    {
      link: '/',
      title: 'Your Answer Details',
      disable: false,
    },
  ]

  return (
    <FullScreenLayout title="Your Answer Details" className="!bg-gray-100">
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
