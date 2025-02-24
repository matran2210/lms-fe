import Breadcrumb from '@components/base/breadcrumb/SappBreadcrumb'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { TEST_TYPE } from '@utils/constants'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { CoursesAPI } from 'src/pages/api/courses'
import { ITabs } from 'src/type'
import { GRADE_STATUS } from 'src/constants'
import { ResultDashBoard } from 'test-result-view-package'
import 'test-result-view-package/dist/index.css'
import { useEffect, useState } from 'react'

interface IScoreDetail {
  metadata: {
    page_index: number
    page_size: number
    total_pages: number
    total_records: number
  }
  answers: Array<any>
}

const TestResultDetail = () => {
  const router = useRouter()

  const useGetScoreDetail = () => {
    const [scoreDetails, setScoreDetails] = useState<IScoreDetail>({
      metadata: {
        total_pages: 0,
        total_records: 0,
        page_index: 0,
        page_size: 10,
      },
      answers: [],
    })

    const fetchScoreDetails = async (
      pageIndex: number = 1,
      pageSize: number = 10,
    ) => {
      try {
        const res = await CoursesAPI.getQuizAttemptsTable(
          router.query.id as string,
          {
            page_index: pageIndex ?? 1,
            page_size: pageSize ?? 10,
          },
        )
        if (res.data) {
          setScoreDetails({
            metadata: res.data.metadata,
            answers: [...scoreDetails.answers, ...res.data.answers],
          })
        }
      } catch {}
    }

    useEffect(() => {
      fetchScoreDetails(1, 10)
    }, [])

    const handleScoreDetailScroll = () => {
      if (
        scoreDetails.metadata.page_index < scoreDetails.metadata.total_pages
      ) {
        fetchScoreDetails(
          scoreDetails.metadata.page_index + 1,
          scoreDetails.metadata.page_size,
        )
      }
    }

    return {
      scoreDetails,
      setScoreDetails,
      handleScoreDetailScroll,
      fetchScoreDetails,
    }
  }

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

  const { scoreDetails, handleScoreDetailScroll } = useGetScoreDetail()
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

  useEffect(() => {
    if (document) {
      document.body.style.fontFamily = 'Roboto, sans-serif'
    }
  }, [document])

  return (
    <FullScreenLayout title="Test Result" className="!bg-gray-3">
      <div className="mx-auto max-w-[1570px]">
        <div className="px-5 xl:container md:px-10">
          <Breadcrumb
            tabs={breadcrumbs}
            currentPage={'Results'}
            className="!text-sm 2xl-max:py-4"
          />
        </div>
        <div className="px-5 xl:container md:px-10">
          <ResultDashBoard
            questions={questions}
            chartData={chartData}
            scoreDetails={scoreDetails}
            onScoreDetailScroll={handleScoreDetailScroll}
            score={
              questions?.quizAttempt?.grading_status ===
              GRADE_STATUS.FINISHED_GRADING
                ? questions?.quizAttempt?.score
                : chartData?.multiple_choice_score
            }
            explanationUrl={'/explanation/{}?title=My Course'}
            onBack={() =>
              router.push(`/courses/my-course/${questions?.class_id ?? ''}`)
            }
          />
        </div>
      </div>
    </FullScreenLayout>
  )
}

export default TestResultDetail
