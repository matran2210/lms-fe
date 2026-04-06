'use client'
import PopupModalTest from '@components/survey/PopupModalTest'
import { useCourseContext, UserType } from '@lms/contexts'
import { ANIMATION, ITabs } from '@lms/core'
import { CourseParts, FilterCourseDetail } from '@lms/feature-courses'
import { CourseSkeleton, LayoutTeacher } from '@lms/ui'
import { useParams, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { CoursesAPI } from 'src/api/courses'
import { PageLink } from 'src/constants/routers'
import { withAuthorization } from '@lms/hoc'

const DEFAULT_PAGESIZE = 18

const CourseDetailTeacher = () => {
  const searchParam = useSearchParams()
  const param = useParams()
  const { courseId } = param
  const query = Object.fromEntries(searchParam.entries())
  const observer = useRef<IntersectionObserver>()

  const params = {
    user_section_learning_status:
      query.user_section_learning_status || undefined,
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
      courseId,
      pageParam || 1,
      DEFAULT_PAGESIZE,
      params,
    )
    return {
      class_user_id: data?.class_user_id,
      is_passed: data?.is_passed,
      data: data?.data?.course_sections_with_progress || [],
      courseDetail: data,
    }
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
    isSuccess,
  } = useInfiniteQuery({
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
    enabled: courseId !== undefined,
    retry: false,
  })

  /**
   * @description gọi lại API khi courseID khác undefined
   */
  useEffect(() => {
    if (courseId !== undefined) {
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
  const is_passed_course = data?.pages?.[0]?.is_passed

  /**
   * @description biến này lấy name của course
   */
  const class_user_id = data?.pages?.[0]?.courseDetail?.class_user_id

  const { setCourseType } = useCourseContext()

  useEffect(() => {
    isSuccess &&
      setCourseType(data.pages[0].courseDetail.data.course_type ?? '')
  })

  const breadcrumbs: ITabs[] = [
    { link: PageLink.MY_CALENDAR, title: 'Home' },
    { link: PageLink.TEACHER_MY_COURSE, title: 'My Course' },
    {
      link: `${PageLink.TEACHER_MY_COURSE}/my-course/${courseId}`,
      title: courseNameDetail || '',
    },
  ]

  return (
    <LayoutTeacher
      title="Course Detail"
      breadcrumbs={breadcrumbs}
      isCourseDetail
    >
      <div className="my-0">
        {isLoading ? (
          <CourseSkeleton />
        ) : (
          <>
            <div className="main relative">
              <div className="flex w-full flex-col justify-end gap-3 pb-4 sm:flex-row sm:items-center">
                <FilterCourseDetail
                  totalResult={courses?.length || 0}
                  isTeacher
                />
              </div>
            </div>
            <div className="pt-6" data-aos={ANIMATION.DATA_AOS}>
              <CourseParts
                courses={courses}
                is_passed_course={is_passed_course ?? false}
                class_user_id={class_user_id}
                lastElementRef={lastElementRef}
                isTeacher
              />
            </div>
          </>
        )}
      </div>
      {isSuccess && (
        <>
          <PopupModalTest
            class_code={data?.pages?.[0]?.courseDetail?.code}
            program={data?.pages?.[0]?.courseDetail?.data?.program}
            data={data?.pages?.[0]?.courseDetail}
          />
        </>
      )}
    </LayoutTeacher>
  )
}

export default withAuthorization([UserType.TEACHER])(CourseDetailTeacher)
