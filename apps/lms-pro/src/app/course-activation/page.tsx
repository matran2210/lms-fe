'use client'
import { useCourseContext, useFeature, UserType } from '@lms/contexts'
import { ANIMATION, TitleSidebar } from '@lms/core'
import {
  CourseActivationList,
  FilterCourseActivation,
} from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import { HeaderMobile, Layout, SappLoadingGlobal } from '@lms/ui'
import Aos from 'aos'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { CoursesActivationAPI } from 'src/api/course-activation'
import { withAuthorization } from '@lms/hoc'

const CourseActivation = () => {
  const { isAlwaysShowSidebar, isTabletView, isMobileView } =
    useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const { query, router, pageLink } = useFeature()

  /**
   * @description handle open and close sidebar
   */

  const handleBack = () => {
    router.push(pageLink.COURSES)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setOpenSidebar(false)
  }

  /**
   * @description Gọi API My Course
   * @param {pageParam, params} pageParam: number, params: Object
   */
  const fetchCourseActivation = async ({ params }: { params: Object }) => {
    const { data } = await CoursesActivationAPI.get(params)
    return data
  }

  /**
   * @description config params khi filter
   */
  const params = {
    program_name: query?.program || undefined,
    subject_name: query?.subject || undefined,
  }

  /**
   * @description sử dụng react-query để lấy data sau khi call API
   */
  const { data, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['courseActivation'],
    queryFn: () => fetchCourseActivation({ params }),
    retry: false,
  })

  /**
   * @description check ref khi scroll đến cuối page thì call API
   */

  // Use useEffect to refetch data when params change
  useEffect(() => {
    refetch()
  }, [params?.program_name, params?.subject_name, refetch])

  /**
   * @description gọi lại animation khi reload lại component
   */
  useEffect(() => {
    Aos.init({ duration: ANIMATION.DURATION, once: true })
  })

  const totalRecords = data?.length || 0

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout
        title="My Course"
        showSidebar={showSidebar || isAlwaysShowSidebar}
        handleToggleSidebar={handleCloseSidebar}
        className="relative"
      >
        <div
          className={clsx(
            'mx-auto mb-6 mt-8 flex items-center justify-between lg:mt-11',
          )}
          data-aos={ANIMATION.DATA_AOS}
        >
          <HeaderMobile
            title={TitleSidebar.COURSE_ACTIVATION}
            showIcon={isTabletView || isMobileView}
            onBack={handleBack}
          />
          <div className="relative">
            <FilterCourseActivation totalResult={totalRecords} />
          </div>
        </div>
        <div
          className={`relative mx-auto my-0 ${
            isEmpty(data)
              ? 'flex min-h-[calc(100vh-21rem)] items-center justify-center'
              : ''
          }`}
        >
          <CourseActivationList
            courses={data}
            refetch={refetch}
            isFetching={isFetching}
          />
        </div>
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(CourseActivation)
