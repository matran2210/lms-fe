import { ArrowRight } from '@assets/icons'
import { StatusQuizTag } from '@components/teacher/components/StatusActionCell'
import { getTimeFromInput } from '@utils/index'
import dayjs from 'dayjs'
import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { ITestQuizProps } from 'src/type/results'

const CardResultTest = ({ quiz, activityName }: ITestQuizProps) => {
  if (!quiz) return null
  const dateSubmitted = quiz?.attempts?.[0]?.updated_at
  const timeSpent = quiz?.attempts?.[0]?.total_attempt_time
  return (
    <div className="flex items-center justify-between gap-2.5 rounded-xl bg-white p-6 shadow-small">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="">{activityName}</div>
          <div className="">
            <StatusQuizTag
              status={
                (quiz?.attempts?.[0]?.status || 'UN_SUBMITTED') as
                  | QUIZ_ATTEMPT_GRADING_STATUS
                  | QUIZ_ATTEMPT_STATUS
              }
            />
          </div>
        </div>
        <div className="flex items-center">
          {dateSubmitted && timeSpent && (
            <div className="flex items-center gap-2">
              <div className="">
                {dateSubmitted
                  ? dayjs(dateSubmitted).format('DD/MM/YYYY HH:mm')
                  : '-'}
              </div>
              <div className="">{getTimeFromInput(timeSpent)}</div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <ArrowRight />
      </div>
    </div>
  )
}

export default CardResultTest
