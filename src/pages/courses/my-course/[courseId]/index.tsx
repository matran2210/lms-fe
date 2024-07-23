import FilterCourseDetail from '@components/mycourses/FilterCourseDetail'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import { CoursesAPI } from 'src/pages/api/courses'
import { ANIMATION } from 'src/constants'
import { useInfiniteQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { useCourseContext } from '@contexts/index'
import Layout from '@components/layout'

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()
  const observer = useRef<IntersectionObserver>()

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  /**
   * @description config API course detail
   */
  const fetchCourseDetail = async ({
    pageParam,
    params,
  }: {
    pageParam: number
    params: Object
  }) => {
    const { data } = await CoursesAPI.getCourseDetail(
      router.query.courseId,
      pageParam || 1,
      DEFAULT_PAGESIZE,
      params,
    )
    return {
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
  }

  /**
   * @description sử dụng react-query để lấy data sau khi call API
   */
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['courseDetail'],
      queryFn: ({ pageParam }) => fetchCourseDetail({ pageParam, params }),
      getNextPageParam: (lastPage, allPages) => {
        if (
          params.user_section_learning_status ||
          params.user_section_learning_status === undefined
        ) {
          return undefined // Prevent fetching more pages if params change
        }
        return lastPage?.data?.length ? allPages.length + 1 : undefined
      },
      enabled: router.query.courseId !== undefined,
    })

  /**
   * @description gọi lại API khi courseID khác undefined
   */
  useEffect(() => {
    if (router.query.courseId !== undefined) {
      refetch()
    }
  }, [params.user_section_learning_status, refetch])

  // Use useEffect to refetch data when params change
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

  /**
   * @description lấy data khi call API course detail
   */
  const courses = useMemo(() => {
    return data?.pages.reduce((acc: any, page: any) => {
      return [...acc, ...page?.data]
    }, [])
  }, [data])

  /**
   * @description biến này lấy name của course
   */
  const courseNameDetail = data?.pages?.[0]?.courseDetail?.data?.name

  /**
   * @description biến này lấy class user id
   */
  const class_user_id = data?.pages?.[0]?.courseDetail?.class_user_id

  /**
   * @description biến này tìm kiếm bài Final Test
   */
  // const sectionFinalTest = courses?.find(
  //   (section) => section?.course_section_type === 'FINAL_TEST',
  // )?.quiz

  const { setCourseType } = useCourseContext()

  useEffect(() => {
    setCourseType(data?.pages?.[0]?.courseDetail?.data?.course_type)
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Course Detail">
        <div className="header bg-white border-b border-e-default">
          <div className="max-w-xxl my-0 mx-auto flex py-6 xl-max:mx-5">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="container max-w-xxl">
          <div className="mx-auto  my-4">
            <div className="flex justify-between items-center">
              <BreadcrumbFilter name={courseNameDetail} />
              <FilterCourseDetail totalResult={courses?.length || 0} />
            </div>
          </div>
          <div
            className="bg-white my-0 mx-auto flex"
            data-aos={ANIMATION.DATA_AOS}
          >
            <Heading greeting="Welcome to" title={courseNameDetail} />
          </div>
          <div className="pt-6 my-0 " data-aos={ANIMATION.DATA_AOS}>
            <CourseParts
              courses={courses}
              class_user_id={class_user_id}
              lastElementRef={lastElementRef}
            />
          </div>
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default CourseDetail
