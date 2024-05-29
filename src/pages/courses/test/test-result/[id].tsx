import React from 'react'
import { ITabs } from 'src/type'
import TestResultPage from './testResultPage'
import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'
import { useGetDataQuery } from '@utils/index'
import { TEST_TYPE } from '@utils/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

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

  // Config Courses
  const breadcrumbs: ITabs[] = [
    {
      link: '/courses',
      title: 'Courses',
    },
    {
      link: `/courses/my-course/${questions?.class_id ?? ''}`,
      title: `${questions?.course?.name ?? 'Course Detail'}`,
    },
    {
      link: `/test/${questions?.quizAttempt?.quiz?.id}?class_user_id=${questions?.quizAttempt?.class_user_id}`,
      title: `${TEST_TYPE[questions?.quizAttempt?.quiz?.quiz_type]}`,
    },
    {
      link: '/',
      title: 'Results',
    },
  ]

  return (
    <>
      <div className="main px-6 xl:px-16">
        <Breadcrumb
          tabs={breadcrumbs}
          currentPage={'Results'}
          className="2xl-max:py-4"
        />
      </div>
      <div className="px-6 xl:px-0 mx-auto xl:mx-16 mb-6">
        <TestResultPage
          questions={questions}
          type={questions?.course?.course_categories[0]?.name}
          chartData={chartData}
          subjectCode={questions?.course?.subject?.code ?? ''}
        />
      </div>
    </>
  )
}

export default TestResultDetail
