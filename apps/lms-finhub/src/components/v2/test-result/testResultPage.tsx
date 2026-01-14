import { useMemo, useRef } from 'react'
import SappLoading from '@components/common/SappLoading'
import MultipleChoiceScore from '@components/v2/test-result/MultipleChoiceScore'
import ScoreDetail from '@components/v2/test-result/ScoreDetail'
import {
  IQuizAttempt,
  IQuizAttemptChartType,
  QuizAttemptChart,
} from '@lms/core'
import { roundNumber } from '@lms/utils'

interface IProps {
  questions: {
    class_id: string
    constructedResponseAnswers: Array<Object>
    course: Object
    quizAttempt: IQuizAttempt
    selectedResponseAnswers: Array<Object>
  }
  type: IQuizAttemptChartType
  chartData: QuizAttemptChart
  subjectCode: string
  score: number
  isTeacher?: boolean
  isLoadingChart?: boolean
}

const TestResultPage = ({
  questions,
  type,
  chartData,
  subjectCode,
  score,
  isTeacher,
  isLoadingChart,
}: IProps) => {
  const multipleQuestionRef = useRef<HTMLDivElement>(null)
  const yourScoreDetailRef = useRef<HTMLDivElement>(null)

  const globalAverageNumber = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 w-full pb-6 pt-20'

  const renderTestResult = useMemo(() => {
    return (
      <div className={commonMultipleScoreStyle}>
        <div className="flex max-h-full flex-col">
          <ScoreDetail
            isTeacher={isTeacher}
            className={'relative'}
            yourScoreDetailRef={yourScoreDetailRef}
            gradingStatus={questions?.quizAttempt?.grading_status}
          />
        </div>
        <MultipleChoiceScore
          questions={questions}
          score={score}
          globalAverage={globalAverageNumber}
          multipleQuestionRef={multipleQuestionRef}
          isLoadingChart={isLoadingChart}
        />
      </div>
    )
  }, [type, chartData, questions, score, globalAverageNumber, subjectCode])

  return <>{!!type ? renderTestResult : <SappLoading />}</>
}

export default TestResultPage
