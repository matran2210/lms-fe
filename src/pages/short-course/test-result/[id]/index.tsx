import { useMemo, useRef, useState } from 'react'
import { Breadcrumb3Level } from '@components/courses'
import QuestionSelector from '@components/courses/test-result/QuestionSelector'
import ScoreChart from '@components/courses/test-result/ScoreChart'
import ScoreDetail from '@components/courses/test-result/ScoreDetail'
import { ITabs } from 'src/type'
import { useGetDataQuery } from '@utils/index'
import { useRouter } from 'next/router'
import { useInfiniteQuery, useQuery } from 'react-query'
import { ResultAPI } from 'src/pages/api/short-course/test-result'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import { DEFAULT_PAGESIZE } from 'src/constants'

const breadcrumbs: ITabs[] = [
  {
    link: `/short-course`,
    title: `My Course`,
    disable: false,
  },
  {
    link: '/',
    title: 'Results',
    disable: false,
  },
]

export default function TestResult() {
  const router = useRouter()
  const [openAnnotation, setOpenAnnotation] = useState(false)
  const questionPanelRef = useRef<HTMLDivElement>(null)
  const scoreDetailRef = useRef<HTMLDivElement>(null)

  const {
    data: scoreDetails,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['scoreDetails', router.query.id],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await ResultAPI.getQuizAttemptsTable(
        router.query.id as string,
        {
          page_index: pageParam,
          page_size: DEFAULT_PAGESIZE,
        },
      )
      if (res.success) {
        return res.data
      }
    },
    getNextPageParam: (lastPage) => {
      if (lastPage) {
        return lastPage?.metadata?.page_index < lastPage?.metadata?.total_pages
          ? lastPage?.metadata?.page_index + 1
          : undefined
      }
    },
    enabled: router.query.id !== undefined,
    retry: false,
  })

  const { data: chartData } = useQuery(
    ['scoreChart', router.query.id],
    () => ResultAPI.getQuizAttemptsChartData(router.query.id as string),
    {
      enabled: !!router.query.id,
      onError: () => {
        throw new Error('Chart data fetch error:')
      },
    },
  )

  const useGetQuizAttempts = (queryKey: string, params: Object) => {
    return useGetDataQuery(
      queryKey,
      params,
      () => ResultAPI.getQuizAttempts(router.query.id),
      router.query.id !== undefined,
      () => router.replace('/short-course'),
    )
  }

  const { data: questions } = useGetQuizAttempts('quiz-attempts', {})

  const dashboard = useMemo(() => {
    if (!chartData) return <div>Loading...</div>

    return (
      <div className="grid w-full grid-cols-1 gap-x-6 xl:grid-cols-test-result">
        <div className="flex max-h-full flex-col" ref={scoreDetailRef}>
          <ScoreChart
            data={chartData?.data?.chart_data || []}
            GlobalAverage={chartData?.data?.quiz_report?.ratio}
            score={chartData?.data?.multiple_choice_score}
            passingScore={chartData?.data?.quiz?.required_percent_score}
          />
          <ScoreDetail
            type="CFA"
            scoreDetails={scoreDetails}
            fetchNextPage={fetchNextPage}
            hasNextPage={hasNextPage}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
        <div ref={questionPanelRef}>
          <QuestionSelector
            questions={questions}
            setOpenAnnotaion={() => setOpenAnnotation(true)}
          />
        </div>
      </div>
    )
  }, [
    chartData,
    scoreDetails,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    questions,
  ])

  return (
    <FullScreenLayout title="Test Result" className="!bg-gray-3">
      <div className="mx-auto max-w-1570">
        <div className="px-5 xl:container md:px-10">
          <Breadcrumb3Level
            tabs={breadcrumbs}
            currentPage={'Results'}
            className="mx-3 md:mx-0 2xl-max:py-4"
          />
          {dashboard}
        </div>
      </div>
    </FullScreenLayout>
  )
}
