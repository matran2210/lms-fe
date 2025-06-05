import QuizResult from 'entrance-test-result-package'
import 'entrance-test-result-package/dist/index.css'
import { useRouter } from 'next/router'
import { CloseIcon } from '@assets/icons'
import { ANIMATION, PageLink } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { useGetDataQuery } from '@utils/index'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import withAuthorization from 'src/HOC/withAuthorization'
import { UserType } from 'src/redux/types/User/urser'

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
      <FullScreenLayout title="Entrance Test Detail">
        <div className="bg-[#F9F9F9]" data-aos={ANIMATION.DATA_AOS}>
          <div
            className="absolute right-6 z-10 ml-auto cursor-pointer"
            onClick={() =>
              router
                .push(PageLink.ENTRANCE_TEST)
                .then(() => window.location.reload())
            }
          >
            <CloseIcon className="transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary" />
          </div>
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
        </div>
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(TestEntranceResult)
