import { ArrowRight } from '@assets/icons'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'
import router from 'next/router'
import Tooltip from 'src/common/Tooltip'
import {
  GRADE_STATUS,
  GRADING_METHOD,
  QUIZ_ATTEMPT_GRADING_STATUS,
  QUIZ_ATTEMPT_STATUS,
} from 'src/constants'
import { EAttemptStatus } from 'src/constants/attempt'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { EDateTime } from 'src/type'

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
  const textButtonViewResult = () => {
    if (
      !resultData?.quiz?.attempts ||
      resultData?.quiz?.attempts?.length === 0
    ) {
      return 'Start'
    }
    const attempt = resultData?.quiz?.attempts?.[0]
    const attemptStatus = attempt?.status
    const gradingMethod = resultData?.quiz?.grading_method
    if (attemptStatus === EAttemptStatus.IN_PROGRESS) {
      return 'Continue'
    }
    if (gradingMethod === GRADING_METHOD.MANUAL) {
      if (
        attemptStatus === EAttemptStatus.SUBMITTED &&
        attempt?.grading_status !== GRADE_STATUS.FINISHED_GRADING
      ) {
        return 'Your Answers Detail'
      }
    }
    return 'View Result'
  }

  const btnViewResult = () => (
    <div className="flex items-center">
      <div className="mr-2 block text-sm font-medium text-gray-800 underline md:hidden">
        {textButtonViewResult()}
      </div>
      <div>
        <ArrowRight />
      </div>
    </div>
  )

  const openInNewTab = (url: string) => {
    if (typeof window === 'undefined') return
    window.open(url, '_blank')
  }

  const handleViewResult = () => {
    if (resultData?.quiz?.attempts?.length > 0) {
      if (resultData?.quiz?.grading_method === GRADING_METHOD.MANUAL) {
        if (resultData?.quiz?.attempts) {
          if (
            resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
          ) {
            if (
              resultData?.quiz?.attempts?.[0]?.grading_status ===
              GRADE_STATUS.FINISHED_GRADING
            ) {
              openInNewTab(
                `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`,
              )
            } else {
              openInNewTab(
                `/courses/test/your-answers-detail/${resultData?.quiz?.attempts?.[0]?.id}`,
              )
            }
          } else if (
            resultData?.quiz?.attempts?.[0]?.status ===
            EAttemptStatus.IN_PROGRESS
          ) {
            openInNewTab(
              `/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
            )
          } else if (
            resultData?.quiz?.attempts?.[0]?.status ===
            EAttemptStatus.UN_SUBMITTED
          ) {
            openInNewTab(
              `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`,
            )
          }
        } else {
          openInNewTab(
            `/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
          )
        }
      } else {
        if (
          resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.IN_PROGRESS
        ) {
          openInNewTab(
            `/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
          )
        } else {
          openInNewTab(
            `/courses/test/test-result/${resultData?.quiz?.attempts?.[0]?.id}`,
          )
        }
      }
    } else {
      openInNewTab(
        `/test/${resultData?.quiz?.id}?class_user_id=${resultData?.class_user_id}`,
      )
    }
  }

  const getAttemptStatus = () => {
    if (resultData?.quiz?.grading_method === GRADING_METHOD.MANUAL) {
      if (
        resultData?.quiz?.attempts?.[0]?.status === EAttemptStatus.SUBMITTED
      ) {
        return resultData?.quiz?.attempts?.[0]?.grading_status
      }
      return resultData?.quiz?.attempts?.[0]?.status
    }

    if (resultData?.quiz?.grading_method === GRADING_METHOD.AUTO) {
      return resultData?.quiz?.attempts?.[0]?.status
    }
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
          <StatusQuizTag status={getAttemptStatus()} />
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
