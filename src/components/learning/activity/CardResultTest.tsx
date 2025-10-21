import { ArrowRight } from '@assets/icons'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'
import router from 'next/router'
import Tooltip from 'src/common/Tooltip'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { EAttemptStatus } from 'src/constants/attempt'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { EDateTime } from 'src/type'
import { ITestQuizProps } from 'src/type/results'

const CardResultTest = ({
  resultData,
  getNameTooltipContent,
  lastElementRef,
}: any) => {
  // }: ITestQuizProps) => {
  const { isMobileView } = useTailwindBreakpoint()
  if (!resultData) return null

  const dateSubmitted = resultData?.quiz?.attempts?.[0]?.updated_at
  const timeSpent = resultData?.quiz?.attempts?.[0]?.total_attempt_time

  const btnViewResult = () => (
    <div className="flex items-center">
      <div className="mr-2 block text-sm font-medium text-gray-800 underline md:hidden">
        View Result
      </div>
      <div>
        <ArrowRight />
      </div>
    </div>
  )
  const handleViewResult = () => {
    resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
      ? router.push(
          `/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
        )
      : router.push(
          `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`,
        )
  }
  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-xl bg-white p-4 shadow-small hover:bg-primary-50 md:p-6"
      ref={lastElementRef}
      onClick={handleViewResult}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Tooltip
            title={getNameTooltipContent?.(resultData)}
            arrow={false}
            placement="topLeft"
          >
            <div className="text-base font-semibold leading-[27px] text-gray-800 md:text-lg">
              {resultData?.name}
            </div>
          </Tooltip>
          <StatusQuizTag
            status={
              (resultData?.quiz?.attempts?.[0]?.status || 'UN_SUBMITTED') as
                | QUIZ_ATTEMPT_GRADING_STATUS
                | QUIZ_ATTEMPT_STATUS
            }
          />
        </div>
        {dateSubmitted && (timeSpent || timeSpent === 0) ? (
          <div className="flex">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="flex">
                <div className="mr-2 text-sm font-normal leading-normal text-gray-400 md:text-base">
                  Last submission:
                </div>
                <div className="text-sm font-medium leading-normal text-gray-800 md:text-base">
                  {dateSubmitted
                    ? dayjs(dateSubmitted).format(EDateTime.fullDate)
                    : '-'}
                </div>
              </div>
              {!isMobileView && <div className="mx-3 text-gray-300">|</div>}
              <div className="flex">
                <div className="mr-2 text-sm font-normal leading-normal text-gray-400 md:text-base">
                  Time spent:
                </div>
                <div className="text-sm font-medium leading-normal text-gray-800 md:text-base">
                  {getTimeFromInput(timeSpent, 'seconds')}
                  {/* {timeSpent} */}
                </div>
              </div>
            </div>
          </div>
        ) : null}
        {isMobileView && btnViewResult()}
      </div>
      {!isMobileView && btnViewResult()}
    </div>
  )
}

export default CardResultTest
