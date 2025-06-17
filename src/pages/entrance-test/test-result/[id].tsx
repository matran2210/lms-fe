import QuizResult from 'entrance-test-result-package'
import { useRouter } from 'next/router'
import { CloseIcon } from '@assets/icons'
import { ANIMATION, PageLink } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { useGetDataQuery } from '@utils/index'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'
import Layout from '@components/layout'

const TestEntranceResult = () => {
  const router = useRouter()
  //todo: call api, make UI

  const { data: chartData, isLoading } = useGetDataQuery(
    'QuizAttemptsChart',
    {},
    () => CoursesAPI.getQuizAttemptsEntranceTestChartData(router.query.id),
    router.query.id !== undefined,
  )

  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className="relative">
        <div
          className="absolute right-10 top-10 z-10 ml-auto cursor-pointer rounded-md bg-gray-200 p-2"
          onClick={() =>
            router
              .push(PageLink.ENTRANCE_TEST)
              .then(() => window.location.reload())
          }
        >
          <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />
        </div>
        <Layout size="xl" title="Entrance Test Detail" showSidebar={false}>
          <div className="mt-12" data-aos={ANIMATION.DATA_AOS}>
            {chartData && (
              <QuizResult
                dataChart={chartData?.chart_data}
                onClick={() =>
                  router.push(`/entrance-test/table-result/${router.query.id}`)
                }
                dataTable={chartData}
                onPublish={() => {}}
                id={undefined}
                is_ops={false}
                handleClose={() => router.push(PageLink.ENTRANCE_TEST)}
              />
            )}
          </div>
        </Layout>
      </div>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(TestEntranceResult)
