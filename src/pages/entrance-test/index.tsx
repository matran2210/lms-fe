import EntranceTestFilter from '@components/entrance-test/EntranceTestFilter'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import React from 'react'
import EntranceTestList from '@components/entrance-test/EntranceTestList'
import PopUpRemindEntrance from '@components/popUpRemindEntrance'
import { ANIMATION } from 'src/constants'
import { useQuery } from 'react-query'
import { EntranceTestAPI } from '../api/entrance-test'
import { useRouter } from 'next/router'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import Layout from '@components/layout'

const EntranceTest = () => {
  // const dispatch = useAppDispatch()
  // useEffect(() => {
  //   dispatch(getEntranceCount())
  // }, [])

  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await EntranceTestAPI.get(params)
      return data
    }

    return useQuery([queryKey, params], fetchData)
  }

  const router = useRouter()
  const { data: entranceTestLists, isLoading } = useGetData('entrance-test', {
    attempt_status: router?.query?.attempt_status,
  })

  return (
    <SappLoadingGlobal loading={isLoading}>
      <Layout title="Entrance Test">
        <div className="header border-b border-default bg-white">
          <div className="mx-auto my-0 flex max-w-xxl py-[18px]">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="main mx-8 my-0 max-w-xxl lg:mx-auto">
          <div className="flex justify-end pb-4 pt-6">
            <EntranceTestFilter count={entranceTestLists?.length || 0} />
          </div>
        </div>
        <div
          className="heading mx-8 my-0 flex max-w-xxl bg-white md:mx-8 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <Heading
            greeting="Welcome to"
            title="Entrance Test"
            des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
          />
        </div>
        <div
          className="mx-8 my-0 max-w-xxl pt-6 lg:mx-8 xl:mx-auto"
          data-aos={ANIMATION.DATA_AOS}
        >
          <EntranceTestList entranceTestLists={entranceTestLists} />
        </div>
        <PopUpRemindEntrance />
      </Layout>
    </SappLoadingGlobal>
  )
}

export default EntranceTest
