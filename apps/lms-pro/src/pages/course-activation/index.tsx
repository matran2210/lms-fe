import { useCourseContext, UserType } from '@lms/contexts'
import { ANIMATION, ICoursesAPI } from '@lms/core'
import {
  CourseActivationList,
  FilterCourseActivation,
} from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import { Layout, SappLoadingGlobal, SearchWithMenuToggle } from '@lms/ui'
import { CoursesActivationAPI } from '@pages/api/course-activation'
import Aos from 'aos'
import clsx from 'clsx'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'

type IProps = {
  api: ICoursesAPI
}
const CourseActivation = () => {
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const router = useRouter()

  /**
   * @description lấy state trong context
   */

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
    program: router.query?.program || undefined,
    subject: router.query?.subject || undefined,
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
  }, [params?.program, params?.subject, refetch])

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
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          isShowUserGuide
          redirectLink={PageLink.COURSE_ACTIVATION}
        />

        <div
          className={clsx(
            'mx-auto mb-6 mt-8 flex items-center justify-between lg:mt-11',
          )}
          data-aos={ANIMATION.DATA_AOS}
        >
          <h1 className="text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl">
            Course Activation
          </h1>
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

export default withAuthorization<IProps>([UserType.STUDENT])(CourseActivation)
