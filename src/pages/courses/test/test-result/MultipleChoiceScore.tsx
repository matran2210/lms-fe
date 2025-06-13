import { isNull, isUndefined } from 'lodash'
import { RefObject } from 'react'
import { GRADE_STATUS } from 'src/constants'
import { IQuizAttempt } from 'src/type'
import GlobalAverage from './GlobalAverage'
import MultipleQuestion from './multipleQuestion'

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
}
const MultipleChoiceScore = ({
  questions,
  score,
  globalAverage,
  multipleQuestionRef,
}: IMultipleChoiceScore) => {
  return (
    <div className="-order-1 xl:order-1">
      <div className="max-h-full w-full pb-6 xl:sticky xl:top-[104px]">
        <div
          className={`w-full justify-between rounded-xl bg-white p-6 shadow-sidebar xl:mb-8`}
        >
          <div className="mb-4 text-2xl font-bold text-gray-800">
            {questions?.quizAttempt?.grading_status ===
            GRADE_STATUS.FINISHED_GRADING
              ? 'Overall Score'
              : 'Multiple Choice Score'}
          </div>
          <div className={`mb-1 font-inter text-7xl font-bold text-primary`}>
            {isNull(score) || isUndefined(score) ? '--' : Math.round(score)}%
          </div>
          <GlobalAverage globalAverage={globalAverage} />
        </div>
        <MultipleQuestion
          questions={questions}
          className={'xl:w-full'}
          multipleQuestionRef={multipleQuestionRef}
        />
      </div>
    </div>
  )
}

export default MultipleChoiceScore
