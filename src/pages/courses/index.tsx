import Filter from '@components/mycourses/Filter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React, { useEffect, useRef, useMemo, useCallback } from 'react'
import CoursesList from '@components/mycourses/CoursesList'
import PopupWelcome from '@components/user-guide/PopupWelcome'
import PopupStep from '@components/user-guide/PopupStep'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { active, increment, reset } from 'src/redux/slice/Course/UserGuide'
import { ANIMATION, UserGuide } from 'src/constants'
import { useRouter } from 'next/router'
import { CoursesAPI } from '../api/courses'
import { useInfiniteQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'

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
  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ['myCourse'],
      queryFn: ({ pageParam }) => fetchMyCourse({ pageParam, params }),
      getNextPageParam: (lastPage, allPages) => {
        if (params.status || params.type) {
          return undefined // Prevent fetching more pages if params change
        }
        return lastPage?.data.length ? allPages.length + 1 : undefined
      },
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

  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className="header bg-white border-b border-default">
        <div
          className={`max-w-xxl my-0 mx-auto flex py-5.75 xl-max:mx-6 relative 
          ${guideStatus && guideStep === 1 ? 'bg-white z-50 px-5' : ''}`}
        >
          <SearchForm
            placeholder="Enter name of course..."
            formStyle="w-full flex items-center"
            // setPage={setPage}
          />
          {guideStatus && guideStep === 1 && (
            <PopupStep
              content={UserGuide.CONTENT_STEP_1}
              className="top-full w-full max-w-[365px] left-0 mt-3"
              index={1}
              total={6}
              handleNext={nextStep}
              handleCancel={closeUserGuide}
            />
          )}
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-auto">
        <div className="flex justify-between xl-max:mx-6">
          <h2 className="text-medium-sm font-medium text-bw-1 pt-6 pb-4">
            My Course
          </h2>
          <div
            className={`pt-6 pb-4 relative ${
              guideStatus && guideStep === 6 ? 'bg-white z-50 px-4 -mr-4' : ''
            }`}
          >
            <Filter courses={data?.pages?.[0]?.category} />
            {guideStatus && guideStep === 6 && (
              <PopupStep
                content={UserGuide.CONTENT_STEP_6}
                className="w-screen max-w-365px top-full right-full mt-3"
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
        className={`heading bg-white max-w-xxl my-0 mx-auto flex relative xl-max:mx-6
        ${guideStatus && guideStep === 4 ? 'z-50' : ''}
      `}
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading
          greeting="Welcome to"
          title="My Course"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
        {guideStatus && guideStep === 4 && (
          <PopupStep
            content={UserGuide.CONTENT_STEP_4}
            className="top-full w-full max-w-365px left-0 mt-3"
            index={4}
            total={6}
            handleNext={nextStep}
            handleCancel={closeUserGuide}
          />
        )}
      </div>
      <div
        className={`pt-6 max-w-xxl my-0 mx-auto relative
        ${guideStatus && guideStep === 5 ? 'sapp-active-item-guide' : ''}
      `}
      >
        {guideStatus && guideStep === 5 && (
          <PopupStep
            content={UserGuide.CONTENT_STEP_5}
            className="w-full max-w-xs 2xl:max-w-[362px] top-0 left-1/2 2xl:left-[33%] mt-6"
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
        />
      </div>
      {guideStatus && guideStep == 0 && <PopupWelcome />}
      {guideStatus && (
        <div
          ref={confirmDialogOverLayRef}
          className={`fixed animate-fade-in-overlay inset-0 bg-black opacity-55 transition-opacity z-40`}
        ></div>
      )}
    </SappLoadingGlobal>
  )
}

export default MyCourse
