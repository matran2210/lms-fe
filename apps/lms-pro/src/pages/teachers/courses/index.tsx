import LayoutTeacher from '@components/layout/Teacher'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import SearchForm from '@components/mycourses/Search'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, PageLink } from '@lms/core'
import { CoursesAPI } from 'src/pages/api/courses'
import { MY_COURSES } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { ITabs } from '@lms/core'
import { FormProvider, useForm } from 'react-hook-form'
import { buildQueryString } from '@lms/utils'

const DEFAULT_PAGESIZE = 9
const breadcrumbs: ITabs[] = [
  { link: PageLink.TEACHERS, title: 'LMS' },
  { link: PageLink.TEACHER_MY_COURSE, title: 'My Course' },
]
const MyCourseTeacher = () => {
  const router = useRouter()
  const observer = useRef<IntersectionObserver>()
  const methods = useForm()
  const queryString = buildQueryString({
    status: router.query?.status || '',
    type: router.query?.type ?? '',
  })
  /**
   * @description Gọi API My Course
   * @param {pageParam, params} pageParam: number, params: Object
   */
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

  /**
   * @description config params khi filter
   */
  const params = {
    name: router.query.name || undefined,
    status: router.query.status || undefined,
    type: router.query.type || undefined,
    template: '4',
  }

  /**
   * @description sử dụng react-query để lấy data sau khi call API
   */
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

  /**
   * @description check ref khi scroll đến cuối page thì call API
   */
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
  const handleSubmit = () => {
    // Redirect to the search results page with the query as a query parameter
    router.push(
      `${PageLink.TEACHER_MY_COURSE}${
        methods.watch('name')?.trim()?.length
          ? `?name=${methods.watch('name')}`
          : ''
      }${queryString}`,
    )
  }
  /**
   * @description lấy data của course khi call API get course
   */
  const courses = useMemo(() => {
    return data?.pages.reduce((acc: any, page) => {
      return [...acc, ...page?.data]
    }, [])
  }, [data])

  // Use useEffect to refetch data when params change
  useEffect(() => {
    refetch()
  }, [params.name, params.status, params.type])

  /**
   * @description gọi lại animation khi reload lại component
   */
  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

  /**
   * @description lưu tổng số course vào session mỗi khi course thay đổi
   */
  useEffect(() => {
    if (courses) {
      window.sessionStorage.setItem('totalCourse', courses?.length)
    }
  }, [courses])

  return (
    <SappLoadingGlobal loading={isLoading}>
      <LayoutTeacher title="My Course" breadcrumbs={breadcrumbs}>
        <FormProvider {...methods}>
          <div className="header border-default border-b bg-white">
            <div className={`relative my-0 flex`}>
              <SearchForm
                placeholder={MY_COURSES.placeholderSearch}
                formStyle="w-full flex items-center"
                handleSubmit={handleSubmit}
                isTeacher
              />
            </div>
          </div>
          <div className="main my-0">
            <div className="flex justify-end">
              <div className={`relative pb-4 pt-6`}>
                <Filter courses={data?.pages?.[0]?.category} isTeacher />
              </div>
            </div>
          </div>
          <div
            // data-aos={ANIMATION.DATA_AOS}
            className={`relative my-0 pt-6 ${
              isEmpty(courses)
                ? 'flex min-h-[calc(100vh-13rem)] items-center justify-center'
                : ''
            }`}
          >
            <CoursesList
              courses={courses}
              lastElementRef={lastElementRef}
              refetch={refetch}
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
              isTeacher
            />
          </div>
        </FormProvider>
      </LayoutTeacher>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.TEACHER])(MyCourseTeacher)
