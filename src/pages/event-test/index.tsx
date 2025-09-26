import EventTestFilter from '@components/event-test/EventTestFilter'
import EventTestList from '@components/event-test/EventTestList'
import Layout from '@components/layout'
import Heading from '@components/mycourses/Heading'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { EventTestAPI } from '../api/event-test'
import { LANG_SIGNIN } from 'src/constants/lang'
import { ANIMATION } from 'src/constants'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import SearchWithMenuToggle from '@components/layout/Header/SearchWithMenuToggle'
import { useCourseContext } from '@contexts/index'
import { useEffect, useState } from 'react'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import Footer from '@components/layout/Footer'
import { getEventCount } from 'src/redux/slice/EventTest/EventTest'
import { useAppDispatch } from 'src/redux/hook'

const EventTest = () => {
  const router = useRouter()
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
        attempt_status: router?.query?.attempt_status,
      })
      return data
    },
    { retry: false },
  )

  const getEventTestCount = async () => await dispatch(getEventCount())
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
    getEventTestCount()
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch, router.query.attempt_status])

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
        {/* <Footer /> */}
        {/* <PopUpRemindEntrance /> */}
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(EventTest)
