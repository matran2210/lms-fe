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
import { useState } from 'react'

const EventTest = () => {
  const { isAlwaysShowSidebar } = useTailwindBreakpoint()
  const { setOpenSidebar } = useCourseContext()
  const [showSidebar, setShowSidebar] = useState(false)
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await EventTestAPI.get(params)
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: !!params, // chỉ thực hiện khi có params,
      retry: false,
    })
  }

  const router = useRouter()
  const { data: eventTestLists, isLoading } = useGetData('event-test', {
    attempt_status: router?.query?.attempt_status,
  })
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
        />
        <div className="main mx-8 my-0 max-w-[1144px] xl:mx-auto">
          <div className="flex flex-col justify-between gap-3 pb-4 pt-6 sm:flex-row">
            <h2 className="text-sm font-medium text-[#050505] ">
              {LANG_SIGNIN.eventTest}
            </h2>
            <EventTestFilter count={eventTestLists?.length || 0} />
          </div>
        </div>
        <div
          className="heading mx-8 my-0 flex max-w-[1144px] bg-white md:mx-8 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <Heading greeting="Welcome to" title={LANG_SIGNIN.eventTest} des="" />
        </div>
        <div
          className="mx-8 my-0 max-w-[1144px] pt-6 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <EventTestList entranceTestLists={eventTestLists} />
        </div>
        {/* <PopUpRemindEntrance /> */}
      </Layout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(EventTest)
