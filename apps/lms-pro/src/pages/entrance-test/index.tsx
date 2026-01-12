import ModalMarketingInApp from '@components/marketing-in-app/ModalMarketingInApp'
import { UserType, getEntranceCount, useCourseContext } from '@lms/contexts'
import { ANIMATION, AppType } from '@lms/core'
import { Heading } from '@lms/feature-courses'
import { useTailwindBreakpoint } from '@lms/hooks'
import { CourseSkeleton, Footer, Layout, SearchWithMenuToggle } from '@lms/ui'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch } from 'src/redux/hook'
import { EntranceTestAPI } from '../api/entrance-test'
import { EntranceTestFilter, EntranceTestList } from '@lms/feature-test'
import SappLoadingGlobal from '@components/common/SappLoadingGlobal'

const EntranceTest = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const [openModalMarketingInApp, setOpenModalMarketingInApp] = useState(false)
  const {
    data: entranceTestLists,
    isLoading,
    refetch,
  } = useQuery(
    ['entrance-test'],
    async () => {
      const { data } = await EntranceTestAPI.get({
        attempt_status: router?.query?.attempt_status,
      })
      return data
    },
    { retry: false },
  )

  const getEntranceTestCount = async () =>
    await dispatch(getEntranceCount(EntranceTestAPI))
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
    getEntranceTestCount()
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch, router.query.attempt_status])

  useEffect(() => {
    const hasOpened = localStorage.getItem('openModalMarketingInApp')
    if (!hasOpened) {
      setOpenModalMarketingInApp(true)
    }
  }, [])

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout
        title="Entrance Test"
        showSidebar={showSidebar || isAlwaysShowSidebar}
        handleToggleSidebar={handleCloseSidebar}
      >
        <SearchWithMenuToggle
          handleOpenSidebar={handleOpenSidebar}
          isShowToggle
          className="mb-6 mt-4"
          redirectLink={PageLink.COURSES}
          appType={AppType.LMS_PRO}
        />
        <div className="my-0">
          {isLoading ? (
            <CourseSkeleton />
          ) : (
            <>
              <div
                className="mb-8 flex overflow-hidden rounded-xl bg-white p-3 shadow-medium md:p-6 lg:px-8 lg:py-6"
                data-aos={ANIMATION.DATA_AOS}
              >
                <Heading
                  showShadow={false}
                  greeting="Welcome to"
                  showWavingHand
                  title="Entrance Test"
                  des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
                />
              </div>
              <div className="relative">
                <div
                  className="mx-auto mb-6 mt-8 flex items-center justify-between md:mb-7 md:mt-9"
                  data-aos={ANIMATION.DATA_AOS}
                >
                  <h2 className="text-lg font-semibold text-gray-800 md:text-xl lg:text-2xl">
                    Entrance Test List
                  </h2>
                  <EntranceTestFilter count={entranceTestLists?.length || 0} />
                </div>
              </div>
              <div className="my-0" data-aos={ANIMATION.DATA_AOS}>
                <EntranceTestList
                  entranceTestLists={entranceTestLists || []}
                  onRefetch={refetch}
                />
              </div>
            </>
          )}
        </div>
        <Footer />
        <ModalMarketingInApp
          open={openModalMarketingInApp}
          setOpen={setOpenModalMarketingInApp}
        />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(EntranceTest)
