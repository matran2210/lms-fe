import Layout from '@components/layout'
import SearchForm from '@components/mycourses/Search'
import CourseParts from '@components/mycourses/course-detail/CourseParts'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import PopupModalTest from '@components/survey/PopupModalTest'
import { useCourseContext } from '@contexts/index'
import { CoursesAPI } from '@pages/api/courses'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import {
  ANIMATION,
  CLASS_TYPE,
  defaultStatusDetail,
  DELAY_TIME_DISPLAY_POPUP,
  PageLink,
} from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import SelectExamPopup from './popups/SelectExamPopup'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import FilterCourse from '@components/mycourses/FilterCourse'
import SappBreadCrumbs from '@components/base/breadcrumb/SappBreadCrumbs'
import PinnedCompletedCourse from '@components/layout/PinnedNotifications/PinnedCompletedCourse'
import { HamburgerMenuLargeIcon } from '@assets/icons'
import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const DEFAULT_PAGESIZE = 18

const CourseDetail = () => {
  const router = useRouter()
  const observer = useRef<IntersectionObserver>()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setshowSidebar] = useState(false)
  const [showSelectExamPopup, setShowSelectExamPopup] = useState(false)
  const [pinnedCompletedCourse, setPinnedCompletedCourse] = useState({
    isOpen: false,
    passedAt: '',
    userCertificateUrl: '',
    userCertificateId: '',
    courseName: '',
  })

  const params = {
    user_section_learning_status:
      router.query.user_section_learning_status || undefined,
  }

  /**
   * @description handle open and close sidebar
   */
  const handleOpenSidebar = () => {
    setshowSidebar(true)
    setOpenSidebar(true)
  }
  const handleCloseSidebar = () => {
    setshowSidebar(false)
    setOpenSidebar(false)
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
  const isTrial =
    data?.pages?.[0]?.courseDetail?.class_type === CLASS_TYPE.TRIAL

  const { setCourseType } = useCourseContext()

  useEffect(() => {
    setCourseType(data?.pages?.[0]?.courseDetail?.data?.course_type)
  })

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isSuccess && data?.pages?.[0]?.courseDetail?.remind_choosing_exam) {
      timeout = setTimeout(() => {
        setShowSelectExamPopup(true)
      }, DELAY_TIME_DISPLAY_POPUP)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [isSuccess, data])

  /**
   * @description hiển thị pinned completed course
   */
  useEffect(() => {
    const courseDetail = data?.pages?.[0]?.courseDetail
    if (!courseDetail) return

    const {
      is_passed: isPassed,
      user_certificate_url: userCertificateUrl,
      user_certificate_id: userCertificateId,
      passed_at: passedAt,
    } = courseDetail

    if (isPassed && userCertificateId) {
      setPinnedCompletedCourse({
        isOpen: isPassed,
        passedAt,
        userCertificateUrl,
        userCertificateId,
        courseName: courseNameDetail,
      })
    }
  }, [data])

  return (
    <Layout
      title="Course Detail"
      showSidebar={showSidebar || isAlwaysShowSidebar}
      handleToggleSidebar={handleCloseSidebar}
    >
      <div className="mb-4 mt-2 flex items-center justify-between gap-2 md:gap-6 lg:mb-6 lg:mt-4">
        <div
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-white p-2 shadow-small md:h-14 md:w-14 lg:hidden"
          onClick={handleOpenSidebar}
        >
          <HamburgerMenuLargeIcon />
        </div>
        <div className="w-full rounded-lg bg-white px-2 py-3 shadow-small md:px-8 md:py-4">
          <SearchForm
            placeholder={MY_COURSES.placeholderSearchV2}
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      {isLoading ? (
        <CourseSkeleton />
      ) : (
        <>
          <SappBreadCrumbs
            isTeacher={false}
            breadcrumbs={[
              {
                title: 'My Course',
                link: PageLink.COURSES,
              },
              {
                title: courseNameDetail,
                link: '',
              },
            ]}
          />
          <div
            className="mt-8 flex items-start justify-between gap-6 lg:my-4"
            data-aos={ANIMATION.DATA_AOS}
          >
            <div className="line-clamp-2 w-[60%] text-xl font-semibold text-gray-800 md:text-2xl lg:text-3xl">
              {courseNameDetail}
            </div>
            <FilterCourse
              totalResult={courses?.length || 0}
              listFilter={[
                {
                  name: 'user_section_learning_status',
                  placeholder: 'Status',
                  options: defaultStatusDetail,
                },
              ]}
            />
          </div>
          <div className="h-full pt-6" data-aos={ANIMATION.DATA_AOS}>
            <CourseParts
              isTrial={isTrial}
              courses={courses}
              is_passed_course={is_passed_course}
              class_user_id={class_user_id}
              lastElementRef={lastElementRef}
            />
          </div>
        </>
      )}

      {isSuccess &&
        data.pages[0].courseDetail.remind_choosing_exam &&
        showSelectExamPopup && <SelectExamPopup courseData={data} />}

      <PopupModalTest
        class_code={data?.pages?.[0]?.courseDetail?.code}
        program={data?.pages?.[0]?.courseDetail?.data?.program}
        data={data?.pages?.[0]?.courseDetail}
      />

      <div className="sticky inset-x-0 bottom-4 z-50">
        <div className="w-full">
          <CtaTrial />
          {!pinnedCompletedCourse.isOpen && (
            <PinnedCompletedCourse
              pinnedCompletedCourse={pinnedCompletedCourse}
            />
          )}
        </div>
      </div>
    </Layout>
  )
}

export default withAuthorization([UserType.STUDENT])(CourseDetail)
