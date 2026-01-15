'use client'
import { FullScreenLayout } from '@lms/ui'
import { TEST_TYPE_LABELS } from '@lms/core'
import { useGetDataQuery } from '@lms/utils'
import { EYourAnswerType, ITabs } from '@lms/core'
import TableQuestions from '@components/your-answers-detail/TableQuestions'
import SappLoading from '@components/common/SappLoading'
import { SappBreadCrumbs } from '@lms/ui'
import { useParams, useRouter } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'

const TestResultDetail = () => {
  const router = useRouter()
  const param = useParams()

  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => CoursesAPI.getQuizAttempts(param.id),
      param.id !== undefined,
      () => router.replace('/short-course'),
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
    linkTest = `/short-course/test/test-result/${param.id}`
  }

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: `/short-course/detail/${questions?.class_id ?? ''}`,
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
                    type={EYourAnswerType.TEST}
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
