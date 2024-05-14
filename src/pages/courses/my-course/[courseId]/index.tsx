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
import SappModalV2 from '@components/base/modal/SappModalV2'
import { AlertIcon, IconCongrats } from '@assets/icons'
import { CourseProvider, useCourseContext } from '@contexts/index'
import ModalCongrats from '@components/mycourses/course-detail/ModalCongrats'

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
  const fecthCourseDetail = async ({
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
      queryFn: ({ pageParam }) => fecthCourseDetail({ pageParam, params }),
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
   * @description biến này lấy name của course
   */
  const class_user_id = data?.pages?.[0]?.courseDetail?.class_user_id

  const courseQuiz = courses?.find(
    (course) => course?.course_section_type === 'FINAL_TEST',
  )?.quiz

  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className="header bg-white border-b border-default h-[70px]">
        <div className="max-w-xxl my-0 mx-auto flex py-6 xl-max:mx-5">
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto xl-max:container relative">
        <div className="flex justify-between pt-6 pb-4 w-full items-center">
          <BreadcrumbFilter name={courseNameDetail} />
          <FilterCourseDetail totalResult={courses?.length || 0} />
        </div>
      </div>
      <div
        className="heading bg-white max-w-xxl my-0 mx-auto flex xl-max:mx-6"
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading greeting="Welcome to" title={courseNameDetail} />
      </div>
      <div
        className="pt-6 max-w-xxl my-0 mx-auto xl-max:container"
        data-aos={ANIMATION.DATA_AOS}
      >
        <CourseParts
          courses={courses}
          class_user_id={class_user_id}
          lastElementRef={lastElementRef}
        />
      </div>
      <ModalCongrats
        name={courseNameDetail}
        course_type={data?.pages?.[0]?.courseDetail?.data?.course_type}
        quiz={courseQuiz}
      />
    </SappLoadingGlobal>
  )
}

export default CourseDetail
