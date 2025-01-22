import Layout from '@components/layout'
import CoursesList from '@components/mycourses/CoursesList'
import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import PopupStep from '@components/user-guide/PopupStep'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import Aos from 'aos'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { ANIMATION, UserGuide } from 'src/constants'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, increment, reset } from 'src/redux/slice/Course/UserGuide'
import { CoursesAPI } from '../api/courses'
import { MY_COURSES } from 'src/constants/lang'

const DEFAULT_PAGESIZE = 9

const MyCourse = () => {
  const dispatch = useAppDispatch()
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const guideIsActive = useAppSelector(
    (state) => state.userGuideReducer?.isActive,
  )
  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)
  const router = useRouter()
  const userGuideLine = useAppSelector(
    (state) => state.userReducer.user.detail.settings?.course_guide,
  )

  const confirmDialogOverLayRef = useRef<HTMLDivElement>(null)
  const observer = useRef<IntersectionObserver>()

  const nextStep = () => {
    dispatch(increment())
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
      dispatch(reset())
    }, 50)
  }
  useEffect(() => {
    if (userGuideLine === 'NOT_ACTIVE' && !guideIsActive) {
      dispatch(active())
    }
  }, [userGuideLine])

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
      <Layout title="My Course">
        <div className="header border-b border-default bg-white">
          <div
            className={`relative mx-auto my-0 flex max-w-xxl py-5.75 xl-max:mx-6 
          ${guideStatus && guideStep === 1 ? 'z-50 bg-white px-5' : ''}`}
          >
            <SearchForm
              placeholder={MY_COURSES.placeholderSearch}
              formStyle="w-full flex items-center"
              // setPage={setPage}
            />
            {guideStatus && guideStep === 1 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_1}
                className="left-0 top-full mt-3 w-full max-w-[22.8125rem]"
                index={1}
                total={6}
                handleNext={nextStep}
                handleCancel={closeUserGuide}
              />
            )}
          </div>
        </div>
        <div className="mx-auto my-0 max-w-xxl pt-6 xl-max:mx-6">
          <div className="main mx-auto my-0 max-w-xxl">
            <div className="flex justify-end xl-max:mx-6">
              <div
                className={`relative pb-4 pt-6 ${
                  guideStatus && guideStep === 6
                    ? 'z-50 -mr-4 bg-white px-4'
                    : ''
                }`}
              >
                <Filter courses={data?.pages?.[0]?.category} />
                {guideStatus && guideStep === 6 && (
                  <PopupStep
                    content={UserGuide.CONTENT_STEP_6}
                    className="right-full top-full mt-3 w-screen max-w-365px"
                    index={6}
                    total={6}
                    handleNext={closeUserGuide}
                    showCancel={false}
                    titleButtonNext="Done"
                  />
                )}
              </div>
            </div>
          </div>
          <div
            className={`heading relative mx-auto my-0 flex max-w-xxl bg-white xl-max:mx-6
          ${guideStatus && guideStep === 4 ? 'z-50' : ''}
        `}
            data-aos={ANIMATION.DATA_AOS}
          >
            <Heading
              greeting="Welcome to"
              title="My Course"
              des={
                <div>
                  Welcome to the start of your learning journey.
                  <br /> It&apos;s time to advance your expertise with our
                  well-designed courses.
                </div>
              }
            />
            {guideStatus && guideStep === 4 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_4}
                className="left-0 top-full mt-3 w-full max-w-365px"
                index={4}
                total={6}
                handleNext={
                  Number(window.sessionStorage.getItem('totalCourse')) > 0
                    ? nextStep
                    : closeUserGuide
                }
                handleCancel={closeUserGuide}
              />
            )}
          </div>
          <div
            // data-aos={ANIMATION.DATA_AOS}
            className={`relative mx-auto my-0 max-w-xxl pt-6 ${
              isEmpty(courses)
                ? 'flex min-h-[calc(100vh-13rem)] items-center justify-center'
                : ''
            } ${guideStatus && guideStep === 5 ? 'sapp-active-item-guide' : ''}`}
          >
            {guideStatus && guideStep === 5 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_5}
                className="left-1/2 top-0 mt-6 w-full max-w-xs 2xl:left-[33%] 2xl:max-w-[22.625rem]"
                index={5}
                total={6}
                handleNext={nextStep}
                handleCancel={closeUserGuide}
              />
            )}
            <CoursesList
              courses={courses}
              lastElementRef={lastElementRef}
              refetch={refetch}
              isFetching={isFetching}
              isFetchingNextPage={isFetchingNextPage}
            />
          </div>
          {guideStatus && guideStep == 0 && <PopupWelcome />}
          {guideStatus && (
            <div
              ref={confirmDialogOverLayRef}
              className={`fixed inset-0 z-40 animate-fade-in-overlay bg-black opacity-55 transition-opacity`}
            ></div>
          )}
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default MyCourse
