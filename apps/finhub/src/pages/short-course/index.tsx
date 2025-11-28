import CoursesList from '@components/courses/card/CoursesList'
import Filter3Level from '@components/courses/filter/Filter'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ANIMATION, AppType } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { CoursesAPI } from '../api/courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import { useCourseContext, UserType } from '@lms/contexts'
import { SearchWithMenuToggle } from '@lms/ui'
import { PageLink } from 'src/constants/routes'
import Layout from '@components/layout'

const DEFAULT_PAGESIZE = 9

const MyCourse3Level = () => {
  const router = useRouter()
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
    name: router.query.name || undefined,
    status: router.query.status || undefined,
    type: router.query.type || undefined,
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
    queryKey: ['myCourse'],
    queryFn: ({ pageParam }) => fetchMyCourse({ pageParam, params }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage?.data.length ? allPages.length + 1 : undefined
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
          appType={AppType.FINHUB}
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

export default withAuthorization([UserType.STUDENT])(MyCourse3Level)
