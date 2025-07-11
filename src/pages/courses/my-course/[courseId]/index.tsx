import Layout from '@components/layout'
import FilterCourseDetail from '@components/mycourses/FilterCourseDetail'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import BreadcrumbFilter from '@components/mycourses/course-detail/BreadcrumbFilter'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import PopupModalTest from '@components/survey/PopupModalTest'
import { useCourseContext } from '@contexts/index'
import { CoursesAPI } from '@pages/api/courses'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import withAuthorization from 'src/HOC/withAuthorization'
import { ANIMATION, DELAY_TIME_DISPLAY_POPUP } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import { UserType } from 'src/redux/types/User/urser'
import { RemindChoosingExam } from 'src/type/course'
import SelectExamPopup from './popups/SelectExamPopup'

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()
  const observer = useRef<IntersectionObserver>()
  const [showSelectExam, setShowSelectExam] = useState(false)

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
    enabled: router.query.courseId !== undefined,
    retry: false,
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

  const canShowExam = (remindChoosingExam: RemindChoosingExam) => {
    return (
      remindChoosingExam.remind_by_progress ||
      remindChoosingExam.remind_by_duration
    )
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (
      isSuccess &&
      canShowExam(data?.pages?.[0]?.courseDetail?.remind_choosing_exam)
    ) {
      timeout = setTimeout(() => {
        setShowSelectExam(true)
      }, DELAY_TIME_DISPLAY_POPUP)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isSuccess, data])

  return (
    <Layout title="Course Detail">
      <div className="border-e-default border-b bg-white">
        <div className="max-w-xxl mx-auto my-0 flex py-6 xl-max:mx-5">
          <SearchForm
            placeholder={MY_COURSES.placeholderSearch}
            formStyle="w-full flex items-center"
          />
        </div>
      </div>

      <div className="max-w-xxl mx-auto my-0 pt-6 xl-max:mx-6">
        {isLoading ? (
          <CourseSkeleton />
        ) : (
          <>
            <div className="main relative">
              <div className="flex w-full flex-col justify-between gap-3 pb-4 sm:flex-row sm:items-center">
                <BreadcrumbFilter name={courseNameDetail ?? ''} />
                <FilterCourseDetail totalResult={courses?.length || 0} />
              </div>
            </div>
            <div className="flex bg-white" data-aos={ANIMATION.DATA_AOS}>
              <Heading greeting="Welcome to" title={courseNameDetail ?? ''} />
            </div>
            <div className="pt-6" data-aos={ANIMATION.DATA_AOS}>
              <CourseParts
                courses={courses}
                is_passed_course={is_passed_course ?? false}
                class_user_id={class_user_id}
                lastElementRef={lastElementRef}
              />
            </div>
          </>
        )}
      </div>
      {isSuccess && (
        <>
          <SelectExamPopup
            showSelectExam={showSelectExam}
            setShowSelectExam={setShowSelectExam}
            courseData={data?.pages?.[0]?.courseDetail}
          />
          <PopupModalTest
            class_code={data?.pages?.[0]?.courseDetail?.code}
            program={data?.pages?.[0]?.courseDetail?.data?.program}
            data={data?.pages?.[0]?.courseDetail}
          />
        </>
      )}
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(CourseDetail)
