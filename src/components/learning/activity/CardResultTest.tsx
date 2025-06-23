import { ArrowRight } from '@assets/icons'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { EDateTime } from 'src/type'
import { ITestQuizProps } from 'src/type/results'

const CardResultTest = ({ resultData, handleViewResult }: ITestQuizProps) => {
  if (!resultData) return null
  const dateSubmitted = resultData?.quiz?.attempts?.[0]?.updated_at
  const timeSpent = resultData?.quiz?.attempts?.[0]?.total_attempt_time
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-small">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="text-lg font-semibold leading-[27px] text-gray-800">
            {resultData?.name}
          </div>
          <StatusQuizTag
            status={
              (resultData?.quiz?.attempts?.[0]?.status || 'UN_SUBMITTED') as
                | QUIZ_ATTEMPT_GRADING_STATUS
                | QUIZ_ATTEMPT_STATUS
            }
          />
        </div>

        {dateSubmitted && timeSpent ? (
          <div className="flex items-center">
            <div className="flex items-center">
              <div className="mr-2 text-base font-normal leading-normal text-gray-400">
                Last submission:
              </div>
              <div className="text-base font-medium leading-normal text-gray-800">
                {dateSubmitted
                  ? dayjs(dateSubmitted).format(EDateTime.fullDate)
                  : '-'}
              </div>
              <div className="mx-3 text-gray-300">|</div>
              <div className="mr-2 text-base font-normal leading-normal text-gray-400">
                Time spent:
              </div>
              <div className="text-base font-medium leading-normal text-gray-800">
                {getTimeFromInput(timeSpent)}
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <div
        className="flex cursor-pointer items-center"
        onClick={() => handleViewResult(resultData)}
      >
        <ArrowRight />
      </div>
    </div>
  )
}

export default CardResultTest
