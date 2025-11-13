import Recommendation from '@components/test/Recommendation'
import { F_LOW_CODES } from '@utils/constants'
import { roundNumber } from '@utils/helpers'
import { useMemo, useRef } from 'react'
import SappLoading from 'src/common/SappLoading'
import { GRADE_STATUS } from 'src/constants'
import {
  IQuizAttempt,
  IQuizAttemptChartType,
  QuizAttemptChart,
  QuizAttemptChartType,
} from 'src/type'
import ChartACCAScore from './acca/chartACCAScore'
import ChartCFAScore from './cfa/chartCFAScore'
import ChartCMAScore from './cma/chartCMAScore'
import MultipleChoiceScore from './MultipleChoiceScore'
import ScoreDetail from './ScoreDetail'

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
  loadingChart?: boolean
  loadingAttempt?: boolean
}

const TestResultPage = ({
  questions,
  type,
  chartData,
  subjectCode,
  score,
  isTeacher,
  loadingChart,
}: IProps) => {
  const multipleQuestionRef = useRef<HTMLDivElement>(null)
  const yourScoreDetailRef = useRef<HTMLDivElement>(null)

  // const handleResize = () => {
  //   const multipleQuestionElem = multipleQuestionRef?.current
  //   const yourScoreDetailElem = yourScoreDetailRef?.current
  //   if (multipleQuestionElem && yourScoreDetailElem) {
  //     const maxHeight = Math.max(
  //       multipleQuestionElem.offsetHeight,
  //       yourScoreDetailElem.offsetHeight,
  //     )
  //     multipleQuestionElem.style.height =
  //       window.innerWidth > 1777
  //         ? `calc(100vh - ${maxHeight}px)`
  //         : 'fit-content'
  //     yourScoreDetailElem.style.marginBottom =
  //       window.innerWidth > 1777
  //         ? '24px'
  //         : `${multipleQuestionElem.offsetHeight}px`
  //     yourScoreDetailElem.style.height = `calc(100vh - ${maxHeight}px)`
  //   }
  // }
  // useEffect(() => {
  //   type !== undefined && handleResize()
  // }, [type, multipleQuestionRef?.current, yourScoreDetailRef?.current])

  // useEffect(() => {
  //   window.addEventListener('resize', handleResize)
  //   return () => {
  //     window.removeEventListener('resize', handleResize)
  //   }
  // }, [])

  const globalAverageNumber = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] gap-6 w-full pb-6'

  const renderDashboard = useMemo(() => {
    switch (type) {
      case QuizAttemptChartType.ACCA: {
        if (F_LOW_CODES.includes(subjectCode)) {
          return (
            <div className={commonMultipleScoreStyle}>
              <div className="flex max-h-full flex-col gap-6">
                <ChartACCAScore
                  data={chartData?.chart_data}
                  loading={loadingChart}
                />
                {questions?.quizAttempt?.attempt_gradings?.map(
                  (item, index) => (
                    <Recommendation data={item} key={index} />
                  ),
                )}
                <ScoreDetail
                  className={'relative'}
                  yourScoreDetailRef={yourScoreDetailRef}
                  type={type}
                  gradingStatus={questions?.quizAttempt?.grading_status}
                  quizAttempt={questions?.quizAttempt}
                  numberSelectedResponse={
                    (questions?.selectedResponseAnswers ?? []).length
                  }
                />
              </div>
              <MultipleChoiceScore
                questions={questions}
                score={score}
                globalAverage={globalAverageNumber}
                multipleQuestionRef={multipleQuestionRef}
              />
            </div>
          )
        } else {
          return (
            <div className={commonMultipleScoreStyle}>
              <div className="flex h-auto w-full flex-col gap-6">
                <ChartCMAScore
                  data={chartData?.chart_data}
                  globalAverage={globalAverageNumber}
                  score={score}
                  isGraded={
                    questions?.quizAttempt?.grading_status ===
                      GRADE_STATUS.FINISHED_GRADING ||
                    !!questions?.quizAttempt?.is_graded
                  }
                  passingScore={chartData?.quiz?.required_percent_score}
                  loadingChart={loadingChart}
                />
                {questions?.quizAttempt?.attempt_gradings?.map(
                  (item, index) => (
                    <Recommendation data={item} key={index} />
                  ),
                )}
                <ScoreDetail
                  className={''}
                  yourScoreDetailRef={yourScoreDetailRef}
                  type={type}
                  gradingStatus={questions?.quizAttempt?.grading_status}
                  numberSelectedResponse={
                    (questions?.selectedResponseAnswers ?? []).length
                  }
                />
              </div>
              <MultipleChoiceScore
                questions={questions}
                score={score}
                globalAverage={globalAverageNumber}
                multipleQuestionRef={multipleQuestionRef}
              />
            </div>
          )
        }
      }
      case 'CFA':
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="max-h-ful flex flex-col gap-6">
              <div className="items-start rounded-xl bg-white p-4 shadow-small md:p-6">
                <ChartCFAScore data={chartData?.chart_data} />
              </div>
              {questions?.quizAttempt?.attempt_gradings?.map((item, index) => (
                <Recommendation data={item} key={index} />
              ))}
              <ScoreDetail
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
                numberSelectedResponse={
                  (questions?.selectedResponseAnswers ?? []).length
                }
              />
            </div>
            <MultipleChoiceScore
              questions={questions}
              score={score}
              globalAverage={globalAverageNumber}
              multipleQuestionRef={multipleQuestionRef}
            />
          </div>
        )
      case QuizAttemptChartType.ENTRANCE_TEST:
      case QuizAttemptChartType.CMA:
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="xl:3/4 flex h-auto w-full flex-col gap-6">
              <ChartCMAScore
                data={chartData?.chart_data}
                globalAverage={globalAverageNumber}
                score={score}
                isGraded={
                  questions?.quizAttempt?.grading_status ===
                    GRADE_STATUS.FINISHED_GRADING ||
                  !!questions?.quizAttempt?.is_graded
                }
                passingScore={chartData?.quiz?.required_percent_score}
                loadingChart={loadingChart}
              />
              {questions?.quizAttempt?.attempt_gradings?.map((item, index) => (
                <Recommendation data={item} key={index} />
              ))}
              <ScoreDetail
                isTeacher={isTeacher}
                className={''}
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
                numberSelectedResponse={
                  (questions?.selectedResponseAnswers ?? []).length
                }
              />
            </div>
            <MultipleChoiceScore
              questions={questions}
              score={score}
              globalAverage={globalAverageNumber}
              multipleQuestionRef={multipleQuestionRef}
            />
          </div>
        )
      default:
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="flex max-h-full flex-col">
              <ScoreDetail
                isTeacher={isTeacher}
                className={'relative'}
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
                numberSelectedResponse={
                  (questions?.selectedResponseAnswers ?? []).length
                }
              />
            </div>
            <MultipleChoiceScore
              questions={questions}
              score={score}
              globalAverage={globalAverageNumber}
              multipleQuestionRef={multipleQuestionRef}
              className="xl:!top-[124px]"
            />
          </div>
        )
    }
  }, [type, chartData, questions, score, globalAverageNumber, subjectCode])

  return renderDashboard
}

export default TestResultPage
