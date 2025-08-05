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
import {
  ANIMATION,
  defaultStatusCourse,
  ECourseType,
  PageLink,
  UserGuide,
} from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, clearGuideState } from 'src/redux/slice/Course/UserGuide'
import { UserType } from 'src/redux/types/User/urser'
import { CoursesAPI } from '../api/courses'
import FilterCourse from '@components/mycourses/FilterCourse'
import { useCourseContext } from '@contexts/index'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import SearchWithMenuToggle from '@components/layout/Header/SearchWithMenuToggle'
import GotoModal from '@components/courses/popup/GotoModal'
import clsx from 'clsx'
import RedirectToMasterModal from '@components/courses/popup/RedirectToMasterModal'
import { useStaticModalContext } from '@contexts/StaticModalContext'

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
  const { generalOrMasterCourse, setGeneralOrMasterCourse } = useCourseContext()
  const { isVisibleGotoModal, setVisibleRedirectToMasterModal } =
    useStaticModalContext()

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
  const handleRedirect = (type: ECourseType) => {
    setGeneralOrMasterCourse(type)
    switch (type) {
      case ECourseType.MASTER:
        setVisibleRedirectToMasterModal(true)
        break
      case ECourseType.GENERAL:
        setVisibleRedirectToMasterModal(false)
        break
      default:
        break
    }
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
          isCoursePage
        />

        <div
          className={
            'flex justify-center rounded-md bg-white shadow-medium md:justify-between lg:rounded-xl'
          }
        >
          <div
            className={`heading relative h-full rounded-md bg-white p-3 md:p-6 lg:rounded-xl lg:px-8 lg:py-6 ${guideStatus && guideStep === 4 ? 'z-50' : ''}`}
            data-aos={ANIMATION.DATA_AOS}
          >
            <Heading
              greeting="Welcome to"
              title={generalOrMasterCourse}
              showShadow={false}
              des="From here, you can access every topic, reading, and video lesson, as well as assignment questions."
            />
            {guideStatus && guideStep === 4 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_4}
                className="left-0 top-full mt-5"
                index={4}
                total={7}
                isEnd={isEndGuide}
                title="Welcome"
                handleCancel={closeUserGuide}
              />
            )}
          </div>
          <div
            className={`hidden items-center rounded-md bg-white p-3 md:flex md:p-6 lg:px-8 lg:py-6 ${guideStatus && guideStep === 5 ? ' z-50 h-auto' : ''}`}
            data-aos={ANIMATION.DATA_AOS}
          >
            <div className="flex gap-2 rounded-[7px] bg-gray-canvas p-1 lg:gap-[10px]">
              <Button
                type={
                  generalOrMasterCourse === ECourseType.MASTER
                    ? 'primary'
                    : 'text'
                }
                block
                onClick={() => handleRedirect(ECourseType.MASTER)}
                className={clsx(
                  'text-sx h-10 w-full p-2 outline-none lg:px-4 lg:text-base',
                  {
                    'font-semibold':
                      generalOrMasterCourse === ECourseType.MASTER,
                    'text-gray-800':
                      generalOrMasterCourse === ECourseType.GENERAL,
                  },
                )}
              >
                Master Finance
              </Button>
              <Button
                type={
                  generalOrMasterCourse === ECourseType.GENERAL
                    ? 'primary'
                    : 'text'
                }
                block
                onClick={() => handleRedirect(ECourseType.GENERAL)}
                className={clsx(
                  'text-sx h-10 w-full p-2 outline-none lg:px-4 lg:text-base',
                  {
                    'font-semibold':
                      generalOrMasterCourse === ECourseType.GENERAL,
                    'text-gray-800':
                      generalOrMasterCourse === ECourseType.MASTER,
                  },
                )}
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
                isEnd={isEndGuide}
                imgSrc={TourGuideCourseTab}
                title="Course Tab"
                handleCancel={closeUserGuide}
              />
            )}
          </div>
        </div>
        <div
          className={clsx(
            'mx-auto mb-6 mt-8 flex items-center justify-between lg:mt-11',
            {
              'relative z-50': guideStatus && guideStep === 7,
            },
          )}
          data-aos={ANIMATION.DATA_AOS}
        >
          <h1 className="text-lg font-semibold text-gray-800 lg:text-2xl">
            My Courses
          </h1>
          <div className="relative">
            <FilterCourse totalResult={totalRecords} listFilter={listFilter} />
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
          className={`relative mx-auto my-0 ${
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
            guideIsActive={guideStatus === true && !isEndGuide}
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
        <GotoModal />

        {!isVisibleGotoModal && guideStatus && guideStep == 0 && (
          <PopupWelcome confirmDialogOverLayRef={confirmDialogOverLayRef} />
        )}
        {guideStatus && (
          <div
            ref={confirmDialogOverLayRef}
            className={`fixed inset-0 z-40 animate-fade-in-overlay bg-black opacity-[.55] transition-opacity`}
          />
        )}
        <RedirectToMasterModal />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(MyCourse)
