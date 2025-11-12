import { isNull, isUndefined } from 'lodash'
import { RefObject } from 'react'
import { GRADE_STATUS } from 'src/constants'
import { IQuizAttempt } from 'src/type'
import GlobalAverage from './GlobalAverage'
import MultipleQuestion from './multipleQuestion'
import clsx from 'clsx'

interface IMultipleChoiceScore {
  questions: {
    class_id: string
    constructedResponseAnswers: Array<Object>
    course: Object
    quizAttempt: IQuizAttempt
    selectedResponseAnswers: Array<Object>
  }
  score: number
  globalAverage: number
  multipleQuestionRef: RefObject<HTMLDivElement>
  loadingAttempt?: boolean
  className?: string
}
const MultipleChoiceScore = ({
  questions,
  score,
  globalAverage,
  multipleQuestionRef,
  loadingAttempt,
  className,
}: IMultipleChoiceScore) => {
  return (
    <>
      {loadingAttempt ? (
        <LoadingMultipleChoice className={className} />
      ) : (
        <div className="-order-1 xl:order-1">
          <div
            className={clsx(
              'max-h-full w-full xl:sticky xl:top-[80px]',
              className,
            )}
          >
            <div
              className={`w-full justify-between rounded-xl bg-white p-4 shadow-small md:p-6 lg:rounded-2xl xl:mb-8`}
            >
              <div className="mb-4 text-lg font-semibold text-gray-800 md:text-xl">
                {questions?.quizAttempt?.grading_status ===
                GRADE_STATUS.FINISHED_GRADING
                  ? 'Overall Score'
                  : 'Multiple Choice Score'}
              </div>
              <div className="flex items-center justify-between lg:block">
                <div
                  className={`mb-1 font-inter text-6xl font-bold text-primary md:text-7xl`}
                >
                  {isNull(score) || isUndefined(score)
                    ? '--'
                    : `${Math.round(score)}%`}
                </div>
                <GlobalAverage globalAverage={globalAverage} />
              </div>
            </div>
            <MultipleQuestion
              questions={questions}
              className={'xl:w-full'}
              multipleQuestionRef={multipleQuestionRef}
            />
          </div>
        </div>
      )}
    </>
  )
}

const LoadingMultipleChoice = ({ className }: { className?: string }) => {
  return (
    <div className="-order-1 animate-pulse xl:order-1">
      <div
        className={clsx('max-h-full w-full xl:sticky xl:top-[80px]', className)}
      >
        {/* Card Overall Score */}
        <div className="w-full justify-between rounded-xl bg-white p-4 md:p-6 lg:rounded-2xl xl:mb-8">
          <div className="mb-4 h-6 w-11/12 rounded-md bg-skeleton" />
          <div className="flex items-center justify-between lg:block">
            <div className="mb-1 h-20 w-full rounded-md bg-skeleton md:h-16" />
            <div className="h-6 w-11/12 rounded-md bg-skeleton lg:mt-3" />
          </div>
        </div>

        {/* Multiple Choice Skeleton */}
        <div className="w-full rounded-xl bg-white p-4 shadow-small md:p-6 lg:rounded-2xl">
          <div className="mb-6 h-8 w-11/12 rounded-md bg-skeleton" />
          <div className="mb-6 h-12 w-11/12 rounded-md bg-skeleton" />
          <div className="grid grid-cols-2 gap-8">
            <div className="h-8 w-full rounded-md bg-skeleton" />
            <div className="h-8 w-full rounded-md bg-skeleton" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default MultipleChoiceScore
