import Layout from '@components/layout'
import CoursesList from '@components/mycourses/CoursesList'
import Heading from '@components/mycourses/Heading'
import PopupStep from '@components/user-guide/PopupStep'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import { Button } from 'antd'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import TourGuideCourseTab from 'src/assets/lotties/tour-guide-course-tab.json'
import TourGuideCourses from 'src/assets/lotties/tour-guide-courses.json'
import TourGuideFilter from 'src/assets/lotties/tour-guide-filter.json'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, defaultStatusCourse, UserGuide } from '@lms/core'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, clearGuideState } from 'src/redux/slice/Course/UserGuide'
import { UserType } from 'src/redux/types/User/urser'
import { CoursesAPI } from '../api/courses'
import FilterCourse from '@components/mycourses/FilterCourse'
import { useCourseContext } from '@contexts/index'
import { useTailwindBreakpoint } from '@lms/hooks'
import SearchWithMenuToggle from '@components/layout/Header/SearchWithMenuToggle'
import ModalMarketingInApp from '@components/marketing-in-app/ModalMarketingInApp'
import clsx from 'clsx'

const DEFAULT_PAGESIZE = 9
const defaultCategory = [
  {
    label: `All`,
    value: '',
  },
]

const MyCourse = () => {
  const isEndGuide = Number(window.sessionStorage.getItem('totalCourse')) <= 0
  const {
    status: guideStatus,
    isActive: guideIsActive,
    step: guideStep,
  } = useAppSelector((state) => state.userGuideReducer)
  const dispatch = useAppDispatch()
  const [openModalMarketingInApp, setOpenModalMarketingInApp] = useState(false)
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()
  const userGuideLine = useAppSelector(
    (state) => state.userReducer.user.detail.settings?.course_guide,
  )
  /**
   * @description lấy state trong context
   */

  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()

  /**
   * @description handle open and close sidebar
   */
  const handleOpenSidebar = () => {
    setShowSidebar(true)
    setOpenSidebar(true)
  }
  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }
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
    name: router.query?.name || undefined,
    status: router.query?.status || undefined,
    type: router.query?.type || undefined,
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
  }, [params?.name, params?.status, params?.type, refetch])

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

  useEffect(() => {
    const hasOpened = localStorage.getItem('openModalMarketingInApp')
    if (!hasOpened) {
      setOpenModalMarketingInApp(true)
    }
  }, [])

  const firstPage = data?.pages?.[0]
  const totalRecords = firstPage?.category?.metadata?.total_records || 0
  const dynamicCategoryOptions =
    firstPage?.category?.total?.map((category: { categoryName: string }) => ({
      label: category.categoryName,
      value: category.categoryName,
    })) || []
  const listFilter = [
    {
      name: 'type',
      placeholder: 'Category',
      options: defaultCategory.concat(dynamicCategoryOptions),
    },
    {
      name: 'status',
      placeholder: 'Status',
      options: defaultStatusCourse,
    },
  ]

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout
        title="My Course"
        showSidebar={showSidebar || isAlwaysShowSidebar}
        handleToggleSidebar={handleCloseSidebar}
        className="relative"
      >
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          isShowUserGuide
          disabledSearch={guideIsActive}
        />

        <div
          className={
            'mt-2 flex justify-center rounded-md bg-white shadow-medium md:mt-4 md:justify-between lg:rounded-xl'
          }
          data-aos={!guideStatus ? ANIMATION.DATA_AOS : ''}
        >
          <div
            className={`relative flex items-center rounded-md bg-white p-3 md:p-6 lg:px-8 lg:py-6 ${guideStatus && guideStep === 4 ? 'z-50' : ''}`}
          >
            <Heading
              greeting="Welcome to"
              title={'My Course'}
              showShadow={false}
              showWavingHand
              des={
                <span>
                  Here you can find all your courses, each packed with{' '}
                  <strong>
                    expert lessons, study materials, and interactive exercises
                  </strong>
                  . Select a course to start learning!
                </span>
              }
            />
            {guideStatus && guideStep === 4 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_4}
                className="left-0 top-full mt-5"
                index={4}
                total={6}
                isEnd={isEndGuide}
                title="Welcome"
                handleCancel={closeUserGuide}
              />
            )}
          </div>
          {/* <div
            className={`hidden items-center rounded-md bg-white p-3 md:flex md:p-6 lg:px-8 lg:py-6 ${guideStatus && guideStep === 5 ? ' z-50 h-auto' : ''}`}
            data-aos={ANIMATION.DATA_AOS}
          >
            {guideStatus && guideStep === 5 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_5}
                className="left-[-400px] top-full mt-5"
                index={5}
                total={7}
                isEnd={isEndGuide}
                imgSrc={TourGuideCourseTab}
                title="Course Tab"
                handleCancel={closeUserGuide}
              />
            )}
          </div> */}
        </div>
        <div
          className={clsx(
            'mx-auto mb-6 mt-8 flex items-center justify-between lg:mt-11',
            {
              'relative z-50': guideStatus && guideStep === 6,
            },
          )}
          data-aos={ANIMATION.DATA_AOS}
        >
          <h1 className="text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl">
            Course List
          </h1>
          <div className="relative">
            <FilterCourse totalResult={totalRecords} listFilter={listFilter} />
            {guideStatus && guideStep === 6 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_6}
                className="right-1/2 top-full mt-5"
                index={6}
                total={6}
                titleButtonNext="Finish"
                title="Filter"
                handleCancel={closeUserGuide}
                imgSrc={TourGuideFilter}
              />
            )}
          </div>
        </div>
        <div
          className={`relative mx-auto my-0 ${
            isEmpty(courses)
              ? 'flex min-h-[calc(100vh-21rem)] items-center justify-center'
              : ''
          } ${guideStatus && guideStep === 5 && 'tour-guide-course-active z-50'}`}
        >
          <CoursesList
            courses={courses}
            lastElementRef={lastElementRef}
            refetch={refetch}
            isFetching={isFetching}
            isFetchingNextPage={isFetchingNextPage}
            guideIsActive={guideStatus === true && !isEndGuide}
          />
          {guideStatus && guideStep === 5 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_5}
              className="left-[50%] top-[20px] mt-6 xl:left-[33.5%]"
              index={5}
              total={6}
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
            className={`fixed inset-0 z-40 animate-fade-in-overlay bg-black opacity-[.55] transition-opacity`}
          />
        )}
        <ModalMarketingInApp
          open={openModalMarketingInApp}
          setOpen={setOpenModalMarketingInApp}
        />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(MyCourse)
