"use client"
import { ITabs, TEST_TYPE_LABELS } from '@lms/core'
import { FullScreenLayout, SappBreadCrumbs, SappLoading } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { CoursesAPI } from 'src/api/courses'
import TableQuestions from '../TableQuestions'

const TestResultDetail = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const params = useParams()
    const {id} = params
    const query = Object.fromEntries(searchParams.entries())
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
        linkTest = `/courses/test/test-result/${params.id}`
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
