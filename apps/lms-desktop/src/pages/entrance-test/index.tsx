import EntranceTestFilter from '@components/entrance-test/EntranceTestFilter'
import EntranceTestList from '@components/entrance-test/EntranceTestList'
import Layout from '@components/layout'
import Heading from '@components/mycourses/Heading'
import SearchForm from '@components/mycourses/Search'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import { ANIMATION } from 'src/constants'
import { EntranceTestAPI } from '../api/entrance-test'
import CourseSkeleton from '@components/skeleton/CourseSkeleton'
import { MY_COURSES } from 'src/constants/lang'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'
import { getEntranceCount } from 'src/redux/slice/EntranceTest/EntranceTest'

const EntranceTest = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const useGetData = (queryKey: string, params: Object) => {
    const fetchData = async () => {
      const { data } = await EntranceTestAPI.get(params)
      return data
    }

    return useQuery([queryKey, params], fetchData, { retry: false })
  }

  const { data: entranceTestLists, isLoading } = useGetData('entrance-test', {
    attempt_status: router?.query?.attempt_status,
  })

  const getEntranceTestCount = async () => await dispatch(getEntranceCount())

  useEffect(() => {
    getEntranceTestCount()
  }, [])

  return (
    <Layout title="Entrance Test">
      <div className="border-b border-default bg-white">
        <div className="relative mx-auto my-0 flex max-w-xxl py-5.75 xl-max:mx-6">
          <SearchForm
            placeholder={MY_COURSES.placeholderSearch}
            formStyle="w-full flex items-center"
          />
        </div>
      </div>
      <div className="mx-auto my-0 max-w-xxl pt-6 xl-max:mx-6">
        {isLoading ? (
          <CourseSkeleton />
        ) : (
          <>
            <div className="main relative">
              <div className="flex w-full flex-col justify-between gap-3 pb-4 sm:flex-row sm:items-center">
                <h2 className="text-medium-sm font-medium text-bw-1 ">
                  Entrance Test
                </h2>
                <EntranceTestFilter count={entranceTestLists?.length || 0} />
              </div>
            </div>
            <div className="flex bg-white" data-aos={ANIMATION.DATA_AOS}>
              <Heading
                greeting="Welcome to"
                title="Entrance Test"
                des="The course is your starting point to learning. From here, you can access every topic, reading, and video lesson, as well as assignment questions."
              />
            </div>
            <div
              className="my-0 max-w-xxl pt-6 xl:mx-auto"
              data-aos={ANIMATION.DATA_AOS}
            >
              <EntranceTestList entranceTestLists={entranceTestLists} />
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default EntranceTest
