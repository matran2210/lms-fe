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

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

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
    return { data: data?.data?.course_sections_with_progress || [], courseDetail: data }
  }

  const observer = useRef<IntersectionObserver>()

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['mycourse-detail'],
      queryFn: ({ pageParam }) => fecthCourseDetail({ pageParam, params }),
      getNextPageParam: (lastPage, allPages) => {
        if (params.user_section_learning_status) {
          return undefined; // Prevent fetching more pages if params change
        }
        return lastPage?.data?.length ? allPages.length + 1 : undefined
      },
      enabled: router.query.courseId !== undefined
    })

    useEffect(() => {
      if(router.query.courseId !== undefined) {
        refetch();
      }
    }, [params.user_section_learning_status, refetch]);

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

  const courses = useMemo(() => {
    return data?.pages.reduce((acc: any, page: any) => {
      return [...acc, ...page?.data]
    }, [])
  }, [data])

  const courseNameDetail = data?.pages?.[0]?.courseDetail?.data?.name

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
        //  class_user_id={class_user_id}
        lastElementRef={lastElementRef}
        />
      </div>
    </SappLoadingGlobal>
  )
}

export default CourseDetail
