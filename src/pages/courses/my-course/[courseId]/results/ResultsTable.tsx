import PaginationSappV2 from '@components/base/pagination/PaginationSappV2'
import { GradingMethod } from '@utils/constants'
import { useRouter } from 'next/router'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useQuery, useInfiniteQuery } from 'react-query'
import { GRADE_STATUS } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { CourseKey } from 'src/pages/api/queryKey'
import { IResultsList, Results } from 'src/type/results'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { ConfirmIcon } from '@assets/icons'
import { TEST_TYPE } from 'src/constants'
import FilterCourseSection from '@components/mycourses/FilterCourseSection'
import CollapseActivity from '@components/learning/activity/CollapseActivity'
import { isEmpty } from 'lodash'
import CardResultTest from '@components/learning/activity/CardResultTest'
import { Avatar, List, Skeleton } from 'antd'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const ResultsTable = () => {
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [openReport, setOpenReport] = useState<boolean>(false)
  const [params, setParams] = useState<any>({})
  const observer = useRef<IntersectionObserver>()
  /**
   * @description sử dụng react-query và infinite query để lấy data
   */
  const {
    data: mobileData,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading: isMobileLoading,
  } = useInfiniteQuery({
    queryKey: ['TestResultMobile'],
    queryFn: ({ pageParam }) =>
      CoursesAPI.getCourseResults(
        router.query.courseId as string,
        pageParam || 1,
        pageSize,
        params && {
          parent_id: params,
        },
      ),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data?.data?.length &&
        allPages?.length < lastPage?.data?.metadata?.total_pages
        ? allPages?.length + 1
        : undefined
    },
    enabled: isMobileView && router.query.courseId !== undefined, // ❗ Chỉ gọi khi là mobile view
    retry: false,
  })

  const dataMobile: IResultsList = useMemo(() => {
    return {
      data: mobileData?.pages.reduce((acc: IResultsList[], page) => {
        return [...acc, ...page?.data?.data]
      }, []),
      class_user_id: mobileData?.pages[0]?.data?.class_user_id,
      metadata: mobileData?.pages[0]?.data?.metadata,
    }
  }, [mobileData])

  const { data: resultData, isLoading } = useQuery<IResultsList>({
    // Fetch lại data khi filter thay đổi
    queryKey: [CourseKey.ResultsList, currentPage, pageSize, params],
    queryFn: () => {
      return CoursesAPI.getCourseResults(
        router.query.courseId as string,
        currentPage || 1,
        pageSize,
        params && {
          parent_id: params,
        },
      )
    },
    enabled: router.query.courseId !== undefined && !isMobileView, // ❗ Chỉ gọi khi là tablet or desktop
    select: (data: { data: any }) => {
      return data.data
    },
    retry: false,
  })

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isMobileLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries?.[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching, isMobileLoading],
  )

  const getScore = (
    rowData: Results,
    grading_method: GradingMethod,
  ): string => {
    const attempt = rowData?.quiz?.attempts[0]
    if (!attempt) return '-'
    if (grading_method === GradingMethod.AUTO)
      return `${attempt?.multiple_choice_score}%`
    if (
      grading_method === GradingMethod.MANUAL &&
      attempt?.grading_status === GRADE_STATUS.FINISHED_GRADING
    ) {
      return `${attempt?.score}%`
    }
    return '-'
  }

  const handleGetLink = (row: Results): string => {
    if (row.course_section_type === TEST_TYPE.ACTIVITY) {
      return `/courses/${router?.query?.courseId}/activity/${row?.id}`
    }

    if (row?.quiz?.attempts?.length) {
      return `/courses/test/test-result/${row?.quiz?.attempts?.[0]?.id}`
    }

    return `/test/${row?.quiz?.id}?class_user_id=${isMobileView ? dataMobile?.class_user_id : resultData?.class_user_id}`
  }

  const getNameTooltipContent = (row: Results) => {
    const link = handleGetLink(row)
    return (
      <div>
        {link ? (
          <div
            onClick={() => {
              router.push(link)
            }}
          >
            <strong className="cursor-pointer text-base hover:underline">
              {row?.name}
            </strong>
          </div>
        ) : (
          <strong className="text-base">{row?.name}</strong>
        )}
        <p className="text-xs">{row?.path}</p>
      </div>
    )
  }

  const groupedDataByType =
    (isMobileView ? dataMobile?.data : resultData?.data || [])?.reduce(
      (acc, item) => {
        const type = item.course_section_type as TEST_TYPE
        if (!Object.values(TEST_TYPE).includes(type)) return acc // bỏ nếu không thuộc TEST_TYPE

        const formattedItem = {
          name: item?.name,
          quiz_activity: item?.quiz_activity || [],
          quiz: item?.quiz || null,
          id: item?.id,
          path: item?.path,
          course_section_type: item?.course_section_type,
        }

        if (!acc[type]) acc[type] = []
        acc[type].push(formattedItem)

        return acc
      },
      {} as Record<TEST_TYPE, any[]>,
    ) || []

  const handleViewResult = (row: Results) => {
    const link = handleGetLink(row)
    if (
      row?.course_section_type !== TEST_TYPE.ACTIVITY &&
      row?.quiz?.grading_method === 'MANUAL' &&
      row?.quiz?.attempts?.[0]?.grading_status === GRADE_STATUS.AWAITING_GRADING
    ) {
      setOpenReport(true)
      return
    }
    router.push(link)
  }

  return (
    <>
      <div className="my-6">
        {!isMobileView && <FilterCourseSection setParams={setParams} />}
      </div>
      {isLoading ? (
        <>
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} active avatar>
              <List.Item.Meta avatar={<Avatar />} />
            </Skeleton>
          ))}
        </>
      ) : (
        <div className="flex flex-col gap-6">
          {!isEmpty(groupedDataByType?.[TEST_TYPE.ACTIVITY]) && (
            <div className="flex flex-col gap-6">
              {groupedDataByType[TEST_TYPE.ACTIVITY]?.map((item) => (
                <CollapseActivity
                  key={item?.id}
                  resultData={item}
                  handleViewResult={handleViewResult}
                  getScore={getScore}
                  lastElementRef={lastElementRef}
                />
              ))}
            </div>
          )}
          {Object.entries(groupedDataByType || {})
            ?.filter(([type]) => type !== TEST_TYPE.ACTIVITY)
            ?.map(([type, data]) =>
              !isEmpty(data) ? (
                <div key={type} className="flex flex-col gap-6">
                  {data.map((item) => (
                    <CardResultTest
                      key={item.id}
                      resultData={item}
                      handleViewResult={handleViewResult}
                      getNameTooltipContent={getNameTooltipContent}
                      lastElementRef={lastElementRef}
                    />
                  ))}
                </div>
              ) : null,
            )}
        </div>
      )}

      {resultData && !isMobileView && (
        <PaginationSappV2
          currentPage={resultData.metadata?.page_index}
          pageSize={resultData.metadata?.page_size}
          totalItems={resultData.metadata?.total_records}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      )}
      <SappModalV3
        open={openReport}
        okButtonCaption="Back"
        handleCancel={() => {}}
        onOk={() => setOpenReport(false)}
        fullWidthBtn={true}
        buttonSize="extra"
        icon={<ConfirmIcon />}
        header="Awating Grading"
        content={`Your test is currently being graded. The result will be sent to you via email as soon as the grading is complete.`}
      />
    </>
  )
}

export default ResultsTable
