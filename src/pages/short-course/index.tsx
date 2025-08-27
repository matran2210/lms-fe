import TabButton from '@components/courses/buttons/TabButton'
import LayoutCourses3Level from '@components/layout/Courses3level'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { ANIMATION } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { IButtonTab } from 'src/type/courses-3-level/button'
import { CoursesAPI } from '../api/courses'
import SearchForm3Level from '@components/courses/shared/SearchForm'
import Filter3Level from '@components/courses/filter/Filter'
import CoursesList from '@components/courses/card/CoursesList'
import { RedirectModal } from '@components/courses'
import { useStaticModalContext } from '@contexts/StaticModalContext'

const DEFAULT_PAGESIZE = 9

const MyCourse3Level = () => {
  const router = useRouter()
  const observer = useRef<IntersectionObserver>()
  const { isVisibleGotoModal, setVisibleRedirectModal, setVisibleGotoModal } =
    useStaticModalContext()

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
    if (!isVisibleGotoModal) return

    setVisibleGotoModal(false)
  }, [isVisibleGotoModal])

  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

  const itemButtonTab: IButtonTab[] = [
    {
      title: 'Master Finance',
      onClick: () => setVisibleRedirectModal(false),
      active: true,
    },
    {
      title: 'General Course',
      onClick: () => setVisibleRedirectModal(true),
    },
  ]

  return (
    <LayoutCourses3Level title="My Course">
      <div className="hidden pt-4 md:block">
        <SearchForm3Level placeholder={MY_COURSES.placeholderSearch3Level} />
      </div>
      <div
        className={`heading relative mx-auto my-0 mt-6 hidden max-w-1524 bg-white md:block xl-max:mx-4`}
        data-aos={ANIMATION.DATA_AOS}
      >
        <div className="flex w-full items-center justify-between gap-8 rounded-md px-8 py-6 shadow-search">
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
          <TabButton items={itemButtonTab} className="!rounded" />
        </div>
      </div>

      <div className="mx-auto mt-4 flex max-w-1524 items-center justify-between gap-8 md:mt-10 xl-max:mx-4">
        <h3 className="text-2xl font-semibold leading-8 text-bw-15">
          My Course
        </h3>
        <Filter3Level courses={data?.pages?.[0]?.category} />
      </div>

      <div className="pt-4 md:hidden">
        <SearchForm3Level placeholder={MY_COURSES.placeholderSearch3Level} />
      </div>

      <div
        className={`relative mx-auto my-0 max-w-1524 pt-6 ${
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
      <RedirectModal />
    </LayoutCourses3Level>
  )
}

export default withAuthorization([UserType.STUDENT])(MyCourse3Level)
