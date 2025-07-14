import EntranceTestFilter from '@components/entrance-test/EntranceTestFilter'
import EntranceTestList from '@components/entrance-test/EntranceTestList'
import Layout from '@components/layout'
import Footer from '@components/layout/Footer'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { ANIMATION } from 'src/constants'
import { MY_COURSES } from 'src/constants/lang'
import withAuthorization from 'src/HOC/withAuthorization'
import { useAppDispatch } from 'src/redux/hook'
import { getEntranceCount } from 'src/redux/slice/EntranceTest/EntranceTest'
import { UserType } from 'src/redux/types/User/urser'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { EntranceTestAPI } from '../api/entrance-test'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import SearchWithMenuToggle from '@components/layout/Header/SearchWithMenuToggle'
import { useCourseContext } from '@contexts/index'

const EntranceTest = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
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

  const getEntranceTestCount = async () => await dispatch(getEntranceCount())
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
        />
        <div className="my-0 pt-6">
          {isLoading ? (
            <CourseSkeleton />
          ) : (
            <>
              <div
                className="mb-8 flex overflow-hidden rounded-xl bg-white"
                data-aos={ANIMATION.DATA_AOS}
              >
                <Heading
                  greeting="Welcome to"
                  title="Entrance Test"
                  des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
                />
              </div>
              <div className="relative">
                <div className="flex w-full flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <h2 className="text-2xl font-semibold text-gray-800 ">
                    Entrance Test
                  </h2>
                  <EntranceTestFilter count={entranceTestLists?.length || 0} />
                </div>
              </div>
              <div className="my-0 pt-7" data-aos={ANIMATION.DATA_AOS}>
                <EntranceTestList
                  entranceTestLists={entranceTestLists || []}
                  onRefetch={refetch}
                />
              </div>
            </>
          )}
        </div>
        <Footer />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(EntranceTest)
