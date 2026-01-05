'use client'
import CoursesList from '@components/courses/card/CoursesList'
import Filter3Level from '@components/courses/filter/Filter'
import Layout from '@components/layout'
import { useCourseContext, useFeature } from '@lms/contexts'
import { ANIMATION, AppType } from '@lms/core'
import { useTailwindBreakpoint } from '@lms/hooks'
import { SearchWithMenuToggle } from '@lms/ui'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { CoursesAPI } from 'src/api/courses'
import { PageLink } from 'src/constants/routes'

const DEFAULT_PAGESIZE = 9

const MyCourse3Level = () => {
  const { query: param } = useFeature()
  const observer = useRef<IntersectionObserver>()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const fetchMyCourse = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.get(
      pageParam || 1,
      DEFAULT_PAGESIZE,
      params,
    )
    return { data: data?.courses || [], category: data }
  }

  const params = {
    name: param.name || undefined,
    status: param.status || undefined,
    type: param.type || undefined,
    template: '3',
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    refetch,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['myCourse', params],
    queryFn: ({ pageParam }) => fetchMyCourse({ pageParam, params }),
    getNextPageParam: (lastPage) => {
      const meta = lastPage?.category?.metadata
      if (!meta) return undefined

      const { page_index, page_size, total_records } = meta

      const hasNext = page_index * page_size < total_records

      return hasNext ? page_index + 1 : undefined
    },
    retry: false,
  })

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      })

      if (node) observer.current.observe(node)
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading],
  )

  const courses = useMemo(() => {
    return data?.pages.reduce((acc: any, page) => {
      return [...acc, ...page?.data]
    }, [])
  }, [data])

  // Use useEffect to refetch data when params change
  useEffect(() => {
    refetch()
  }, [params.name, params.status, params.type])

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

  const handleOpenSidebar = () => {
    setShowSidebar(true)
    setOpenSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }

  return (
    <Layout
      title="My Course"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
      className="relative"
    >
      <div className="pt-4 lg:pt-0">
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          isShowUserGuide
          redirectLink={PageLink.SHORT_COURSE}
          appType={AppType.LMS_FINHUB}
        />
      </div>
      <div
        className="heading relative my-0 mt-4 hidden max-w-1524 rounded-lg bg-white shadow-search md:block"
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="flex w-full items-center justify-between gap-8 rounded-lg px-8 py-6">
          <div>
            <div>
              <h1 className="line-clamp-1 text-3xl font-medium leading-[46px] text-bw-15">
                Welcome to
                <span className="ml-1.5 font-medium text-primary">
                  Master Finance
                </span>
              </h1>
            </div>
            <div className="mt-1 flex w-full">
              <div className="w-full text-medium-sm leading-[22px] text-bw-15">
                From here, you can access every topic, reading, and video
                lesson, as well as assignment questions.
              </div>
            </div>
          </div>
          {/* <TabButton items={itemButtonTab} className="!rounded" /> */}
        </div>
      </div>

      <div className="mt-4 flex max-w-1524 items-center justify-between gap-8 md:mt-10">
        <h3 className="text-lg font-semibold leading-8 text-bw-15 md:text-2xl">
          Course List
        </h3>
        <Filter3Level courses={data?.pages?.[0]?.category} />
      </div>

      <div
        className={`relative my-0 max-w-1524 pt-6 ${
          isEmpty(courses)
            ? 'flex min-h-[calc(100vh-22rem)] items-center justify-center'
            : ''
        }`}
      >
        <CoursesList
          courses={courses}
          lastElementRef={lastElementRef}
          refetch={refetch}
          isFetching={isFetching}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>
    </Layout>
  )
}

export default memo(MyCourse3Level)
