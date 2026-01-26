'use client'
import {
  UserType,
  getEventCount,
  useAppDispatch,
  useCourseContext,
} from '@lms/contexts'
import { ANIMATION, AppType, LANG_SIGNIN } from '@lms/core'
import { Heading } from '@lms/feature-courses'
import { EventTestFilter, EventTestList } from '@lms/feature-test'
import { useTailwindBreakpoint } from '@lms/hooks'
import {
  CourseSkeleton,
  Footer,
  Layout,
  SappLoadingGlobal,
  SearchWithMenuToggle,
} from '@lms/ui'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import withAuthorization from 'src/HOC/withAuthorization'
import { EventTestAPI } from 'src/api/event-test'
import { PageLink } from 'src/constants/routers'

const EventTest = () => {
  const searchParam = useSearchParams()
  const query = Object.fromEntries(searchParam.entries())
  const dispatch = useAppDispatch()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)

  const {
    data: eventTestLists,
    isLoading,
    refetch,
  } = useQuery(
    ['event-test'],
    async () => {
      const { data } = await EventTestAPI.get({
        attempt_status: query?.attempt_status,
      })
      return data
    },
    { retry: false },
  )

  const getEventTestCount = async () =>
    await dispatch(getEventCount(EventTestAPI))
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

  useEffect(() => {
    console.log('vo day à')
    getEventTestCount()
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch, query.attempt_status])

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout
        title={LANG_SIGNIN.eventTest}
        showSidebar={showSidebar || isAlwaysShowSidebar}
        handleToggleSidebar={handleCloseSidebar}
      >
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          className="my-4"
          redirectLink={PageLink.COURSES}
          appType={AppType.LMS_PRO}
        />
        <div className="my-0">
          {isLoading ? (
            <CourseSkeleton />
          ) : (
            <>
              <div
                className="mb-8 flex overflow-hidden rounded-xl bg-white p-3  shadow-medium md:p-6 lg:px-8 lg:py-6"
                data-aos={ANIMATION.DATA_AOS}
              >
                <Heading
                  showShadow={false}
                  greeting="Welcome to"
                  showWavingHand
                  title={LANG_SIGNIN.eventTest}
                  des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
                />
              </div>
              <div className="relative">
                <div
                  className="mx-auto mb-6 mt-8 flex items-center justify-between md:mb-7 md:mt-9"
                  data-aos={ANIMATION.DATA_AOS}
                >
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {LANG_SIGNIN.eventTest}
                  </h2>
                  <EventTestFilter count={eventTestLists?.length || 0} />
                </div>
              </div>
              <div className="my-0" data-aos={ANIMATION.DATA_AOS}>
                <EventTestList
                  eventTestLists={eventTestLists}
                  onRefetch={refetch}
                />
              </div>
            </>
          )}
        </div>
        <Footer />
        {/* <PopUpRemindEntrance /> */}
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(EventTest)
