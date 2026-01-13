import SappLoadingGlobal from '@components/common/SappLoadingGlobal'
import { CloseIcon } from '@lms/assets'
import { UserType } from '@lms/contexts'
import { ANIMATION } from '@lms/core'
import { Layout, PinnedNotificationsV2 } from '@lms/ui'
import { useGetDataQuery } from '@lms/utils'
import QuizResult from '@sapp-fe/entrance-test-result-package'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { PageLink } from 'src/constants/routers'
import withAuthorization from 'src/HOC/withAuthorization'
import { CoursesAPI } from 'src/pages/api/courses'

const TestEntranceResult = () => {
  const router = useRouter()
  const [showPinnedNotification, setShowPinnedNotification] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const { attempt } = router.query
  const { data: chartData, isLoading } = useGetDataQuery(
    'QuizAttemptsChart',
    {},
    () => CoursesAPI.getQuizAttemptsEntranceTestChartData(router.query.id),
    router.query.id !== undefined,
  )

  // Hàm xử lý khi bấm close
  const handleClosePinnedNotification = () => {
    setIsFading(true)
    setTimeout(() => {
      setShowPinnedNotification(false)
      setIsFading(false)
    }, 500) // 300ms trùng với thời gian transition
  }

  return (
    <SappLoadingGlobal loading={isLoading}>
      <div className="relative">
        <div
          className="absolute right-4 top-4 z-10 ml-auto cursor-pointer rounded-md bg-gray-200 p-1 md:right-10 md:top-12 md:p-2"
          onClick={
            () => router.push(PageLink.ENTRANCE_TEST)
            // .then(() => window.location.reload())
          }
        >
          <CloseIcon className="h-4.5 w-4.5 transform stroke-[#050505] transition-all duration-300 ease-in-out group-hover:stroke-primary md:h-6 md:w-6" />
        </div>
        <Layout size="xl" title="Entrance Test Detail" showSidebar={false}>
          <div className="relative mt-4 md:mt-12" data-aos={ANIMATION.DATA_AOS}>
            {chartData && (
              <QuizResult
                dataChart={chartData?.chart_data}
                onClick={() =>
                  router.push(
                    `/entrance-test/table-result/${router.query.id}?attempt=${attempt}`,
                  )
                }
                dataTable={chartData}
                onPublish={() => {}}
                id={undefined}
                is_ops={false}
                handleClose={() => router.push(PageLink.ENTRANCE_TEST)}
              />
            )}
            {showPinnedNotification && (
              <div
                className={`sticky bottom-4 z-10 mt-10 transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}
              >
                <PinnedNotificationsV2
                  bgColor="bg-primary-200"
                  borderColor="border-primary"
                  classPinned="items-start justify-between lg:items-center"
                >
                  <div className="text-xs leading-5 md:text-sm">
                    Đội ngũ chuyên viên của SAPP sẽ liên lạc lại với bạn trong
                    vòng 24h (không kể Thứ 7, Chủ nhật) để tư vấn thiết kế lộ
                    trình học tập cá nhân hóa phù hợp với kết quả bài đánh giá
                    và mục tiêu của bạn. Mọi thắc mắc vui lòng liên hệ tới
                    Hotline:{' '}
                    <a href="tel:19002225" className="font-bold underline">
                      19002225
                    </a>{' '}
                    hoặc{' '}
                    <a
                      href="https://www.facebook.com/sapp.edu.vn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline"
                    >
                      Fanpage
                    </a>{' '}
                    để được hỗ trợ nhanh chóng nhất. SAPP Academy mong rằng sẽ
                    được đồng hành cùng bạn trong lộ trình học tập sắp tới.
                  </div>
                  <span
                    className="cursor-pointer"
                    onClick={handleClosePinnedNotification}
                  >
                    <CloseIcon />
                  </span>
                </PinnedNotificationsV2>
              </div>
            )}
          </div>
        </Layout>
      </div>
    </SappLoadingGlobal>
  )
}

export default withAuthorization([UserType.STUDENT])(TestEntranceResult)
