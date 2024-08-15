import QuizResult from 'entrance-test-result-package'
import 'entrance-test-result-package/dist/index.css'
import { useRouter } from 'next/router'
import { CloseIcon } from '@assets/icons'
import { ANIMATION, PageLink } from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import SappLoadingGlobal from 'src/common/SappLoadingGlobal'
import { useGetDataQuery } from '@utils/index'
import FullScreenLayout from '@components/layout/FullScreenLayout'
import PopupNotCus from '@components/entrance-test/PopupNotCus'
import { useState } from 'react'

const TestEntranceResult = () => {
  const router = useRouter()
  //todo: call api, make UI
  // return <></>

  const { data: chartData, isLoading } = useGetDataQuery(
    'QuizAttemptsChart',
    {},
    () => CoursesAPI.getQuizAttemptsChartData(router.query.id),
    router.query.id !== undefined,
  )

  const [openScoreDetail, setOpenScoreDetail] = useState(false)

  return (
    <SappLoadingGlobal loading={isLoading}>
      <FullScreenLayout title="Entrance Test Detail">
        <div className="bg-gray-4" data-aos={ANIMATION.DATA_AOS}>
          <div
            className="absolute right-6 top-[18px]  ml-auto cursor-pointer"
            onClick={() => router.push(PageLink.ENTRANCE_TEST)}
          >
            <CloseIcon className="transform stroke-bw-1 transition-all duration-300 ease-in-out group-hover:stroke-primary" />
          </div>
          <QuizResult
            dataChart={chartData?.chart_data}
            onClick={() =>
              chartData?.is_publish_detail
                ? router.push(`/entrance-test/table-result/${router.query.id}`)
                : setOpenScoreDetail(true)
            }
            dataTable={chartData}
            onPublish={() => {}}
            id={undefined}
            is_ops={false}
          />
        </div>
        <PopupNotCus open={openScoreDetail} setOpen={setOpenScoreDetail} />
      </FullScreenLayout>
    </SappLoadingGlobal>
  )
}

export default TestEntranceResult
