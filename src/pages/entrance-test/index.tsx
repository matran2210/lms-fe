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
      <Layout title='Entrance Test'>
        <div className="header bg-white border-b border-default">
          <div className="max-w-xxl my-0 mx-auto flex py-[18px]">
            <SearchForm
              placeholder="Enter name of course..."
              formStyle="w-full flex items-center"
            />
          </div>
        </div>
        <div className="main max-w-xxl my-0 mx-8 lg:mx-auto">
          <div className="flex justify-between pt-6 pb-4">
            <h2 className="text-medium-sm font-medium text-bw-1 ">
              Entrance Test
            </h2>
            <EntranceTestFilter count={entranceTestLists?.length || 0} />
          </div>
        </div>
        <div
          className="heading bg-white max-w-xxl my-0 flex mx-8 xl:mx-auto lg:mx-8 md:mx-8"
          data-aos={ANIMATION.DATA_AOS}
        >
          <Heading
            greeting="Welcome to"
            title="Entrance Test"
            des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
          />
        </div>
      </div>
      <div className="main max-w-xxl my-0 mx-8 lg:mx-auto">
        <div className="flex justify-between pt-6 pb-4">
          <h2 className="text-medium-sm font-medium text-bw-1 ">
            Entrance Test
          </h2>
          <EntranceTestFilter count={entranceTestLists?.length || 0} />
        </div>
      </div>
      <div
        className="heading bg-white max-w-xxl my-0 flex mx-8 xl:mx-auto lg:mx-8 md:mx-8"
        data-aos={ANIMATION.DATA_AOS}
      >
        <Heading
          greeting="Welcome to"
          title="Entrance Test"
          des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
        />
      </div>
      <div
        className="pt-6 max-w-xxl my-0 mx-8 xl:mx-auto lg:mx-8"
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