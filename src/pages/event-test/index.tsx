import EventTestFilter from '@components/event-test/EventTestFilter'
import EventTestList from '@components/event-test/EventTestList'
import Layout from '@components/layout'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import Layout from '@components/layout'
import EventTestFilter from '@components/event-test/EventTestFilter'
import EventTestList from '@components/event-test/EventTestList'
import { EventTestAPI } from '../api/event-test'
import { LANG_SIGNIN, MY_COURSES } from 'src/constants/lang'
import { isEmpty } from 'lodash'
import { ANIMATION } from 'src/constants'

const EventTest = () => {
  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await EventTestAPI.get(params)
      return data
    }

    return useQuery([queryKey, params], fetchData, {
      enabled: !!params, // chỉ thực hiện khi có params
    })
  }

  const router = useRouter()
  const { data: eventTestLists, isLoading } = useGetData('event-test', {
    attempt_status: router?.query?.attempt_status,
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title={LANG_SIGNIN.eventTest}>
        <div className="border-b border-default bg-white">
          <div className="mx-auto my-0 flex max-w-xxl py-[18px]">
            <SearchForm
              placeholder={MY_COURSES.placeholderSearch}
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="main mx-8 my-0 max-w-xxl lg:mx-auto">
          <div className="flex justify-between pb-4 pt-6">
            <h2 className="text-medium-sm font-medium text-bw-1 ">
              {LANG_SIGNIN.eventTest}
            </h2>
            <EventTestFilter count={eventTestLists?.length || 0} />
          </div>
        </div>
        <div
          className="heading mx-8 my-0 flex max-w-xxl bg-white md:mx-8 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <Heading greeting="Welcome to" title={LANG_SIGNIN.eventTest} des="" />
        </div>
        <div
          className="mx-8 my-0 max-w-xxl pt-6 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <EventTestList entranceTestLists={eventTestLists} />
        </div>
        <PopUpRemindEntrance />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default EventTest
