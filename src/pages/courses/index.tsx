import Layout from '@components/layout'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import PopupStep from '@components/user-guide/PopupStep'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import { Button, Col, Row } from 'antd'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import TourGuideCourseTab from 'src/assets/lotties/tour-guide-course-tab.json'
import TourGuideCourses from 'src/assets/lotties/tour-guide-courses.json'
import TourGuideFilter from 'src/assets/lotties/tour-guide-filter.json'
import TourGuideStart from 'src/assets/lotties/tour-guide-start.json'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, UserGuide } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, clearGuideState } from 'src/redux/slice/Course/UserGuide'
import { UserType } from 'src/redux/types/User/urser'
import { CoursesAPI } from '../api/courses'

const DEFAULT_PAGESIZE = 9
const MASTER = 'Master Finance'
const GENERAL = 'General Course'

const MyCourse = () => {
  const {
    status: guideStatus,
    isActive: guideIsActive,
    step: guideStep,
  } = useAppSelector((state) => state.userGuideReducer)
  const dispatch = useAppDispatch()

  const router = useRouter()
  const userGuideLine = useAppSelector(
    (state) => state.userReducer.user.detail.settings?.course_guide,
  )

  const [courseType, setCourseType] = useState(MASTER)

  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()

  const closeUserGuide = () => {
    if (confirmDialogOverLayRef.current) {
      confirmDialogOverLayRef.current.classList.add('animate-fade-out-overlay')
      confirmDialogOverLayRef.current.classList.add('pointer-events-none')
    }
    // Remove hidden scroll when close user guide
    document.body.style.removeProperty('padding-right')
    document.body.classList.remove('overflow-hidden')
    setTimeout(() => {
      dispatch(clearGuideState())
    }, 50)
  }

  useEffect(() => {
    if (userGuideLine === 'NOT_ACTIVE' && !guideIsActive) {
      dispatch(active())
    }
  }, [dispatch, guideIsActive, userGuideLine])

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
  }, [params.name, params.status, params.type, refetch])

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
      <Layout title="My Course">
        <div className="header mb-6 border-b border-default bg-white">
          <div
            className={`relative mx-auto my-4 flex max-w-xxl rounded-md py-3 xl-max:mx-6 
              ${guideStatus && guideStep === 1 ? 'z-50 bg-white px-5' : ''}`}
          >
            <SearchForm
              placeholder={MY_COURSES.placeholderSearch}
              formStyle="w-full flex items-center"
              disabled={guideIsActive}
            />
            {guideStatus && guideStep === 1 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_1}
                className="left-0 top-full mt-3"
                title={'Search box'}
                index={1}
                total={7}
                imgSrc={TourGuideStart}
              />
            )}
          </div>
        </div>

        <Row className="mx-auto my-0 flex max-w-xxl rounded-md bg-white shadow-sidebar">
          <Col
            span={16}
            className={`heading relative rounded-md bg-white xl-max:mx-6
        ${guideStatus && guideStep === 4 ? 'z-50' : ''}
      `}
            data-aos={ANIMATION.DATA_AOS}
          >
            <Heading
              greeting="Welcome to"
              title={courseType}
              showShadow={false}
              des={
                <div>
                  From here, you can access every topic, reading, and video
                  lesson, as well as assignment questions.
                </div>
              }
            />
            {guideStatus && guideStep === 4 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_4}
                className="left-0 top-full mt-5"
                index={4}
                total={7}
                isEnd={
                  Number(window.sessionStorage.getItem('totalCourse')) <= 0
                }
                title="Welcome"
              />
            )}
          </Col>
          <Col
            span={8}
            className={`grid place-items-center rounded-md bg-white
        ${guideStatus && guideStep === 5 ? 'z-50' : ''}
      `}
            data-aos={ANIMATION.DATA_AOS}
          >
            <div className="flex gap-2 rounded-md bg-gray-4 p-1">
              <Button
                type={courseType === MASTER ? 'primary' : 'text'}
                block
                onClick={() => setCourseType(MASTER)}
                className="h-10"
              >
                Master Finance
              </Button>
              <Button
                type={courseType === GENERAL ? 'primary' : 'text'}
                block
                onClick={() => setCourseType(GENERAL)}
                className="h-10"
              >
                General Course
              </Button>
            </div>
            {guideStatus && guideStep === 5 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_5}
                className="left-0 top-full mt-5"
                index={5}
                total={7}
                isEnd={
                  Number(window.sessionStorage.getItem('totalCourse')) <= 0
                }
                imgSrc={TourGuideCourseTab}
                title="Course Tab"
              />
            )}
          </Col>
        </Row>
        <div className="mx-auto mb-6 mt-8 flex max-w-xxl items-center justify-between">
          <h1 className="text-2xl font-semibold">My Courses</h1>
          <div className={`relative`}>
            <Filter
              courses={data?.pages?.[0]?.category}
              tourGuideActive={guideStatus && guideStep === 7}
            />
            {guideStatus && guideStep === 7 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_7}
                className="right-1/2 top-full mt-5"
                index={7}
                total={7}
                titleButtonNext="Finish"
                title="Filter"
                handleCancel={closeUserGuide}
                imgSrc={TourGuideFilter}
              />
            )}
          </div>
        </div>
        <div
          className={`relative mx-auto my-0 max-w-xxl ${
            isEmpty(courses)
              ? 'flex min-h-[calc(100vh-13rem)] items-center justify-center'
              : ''
          } ${guideStatus && guideStep === 6 && 'tour-guide-course-active'}`}
        >
          <CoursesList
            courses={courses}
            lastElementRef={lastElementRef}
            refetch={refetch}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            guideIsActive={guideStatus === true}
          />
          {guideStatus && guideStep === 6 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_6}
              className="top-[20px] mt-6 2xl:left-[33.5%]"
              index={6}
              total={7}
              title="Courses"
              imgSrc={TourGuideCourses}
            />
          )}
        </div>
        {guideStatus && guideStep == 0 && (
          <PopupWelcome confirmDialogOverLayRef={confirmDialogOverLayRef} />
        )}
        {guideStatus && (
          <div
            ref={confirmDialogOverLayRef}
            className={`fixed inset-0 z-40 animate-fade-in-overlay bg-black opacity-55 transition-opacity`}
          />
        )}
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(MyCourse)
