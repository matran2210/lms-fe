import Recommendation from '@components/test/Recommendation'
import { F_LOW_CODES } from '@utils/constants'
import { roundNumber } from '@utils/helpers'
import { isNull, isUndefined } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import SappLoading from 'src/common/SappLoading'
import { GRADE_STATUS } from 'src/constants'
import {
  IQuizAttempt,
  IQuizAttemptChartType,
  QuizAttemptChart,
  QuizAttemptChartType,
} from 'src/type'
import ChartACCAScore from './acca/chartACCAScore'
import MultipleChoiceScore from './cfa/MultipleChoiceScore'
import ChartCMAScore from './cma/chartCMAScore'
import GlobalAverage from './GlobalAverage'
import MultipleQuestion from './multipleQuestion'
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
}

const TestResultPage = ({
  questions,
  type,
  chartData,
  subjectCode,
  score,
}: IProps) => {
  const multipleQuestionRef = useRef<HTMLDivElement>(null)
  const yourScoreDetailRef = useRef<HTMLDivElement>(null)

  const [openAnnotaion, setOpenAnnotaion] = useState(false)

  const handleResize = () => {
    const multipleQuestionElem = multipleQuestionRef?.current
    const yourScoreDetailElem = yourScoreDetailRef?.current
    if (multipleQuestionElem && yourScoreDetailElem) {
      const maxHeight = Math.max(
        multipleQuestionElem.offsetHeight,
        yourScoreDetailElem.offsetHeight,
      )
      multipleQuestionElem.style.height =
        window.innerWidth > 1777
          ? `calc(100vh - ${maxHeight}px)`
          : 'fit-content'
      yourScoreDetailElem.style.marginBottom =
        window.innerWidth > 1777
          ? '24px'
          : `${multipleQuestionElem.offsetHeight}px`
      yourScoreDetailElem.style.height = `calc(100vh - ${maxHeight}px)`
    }
  }
  useEffect(() => {
    type !== undefined && handleResize()
  }, [type, multipleQuestionRef?.current, yourScoreDetailRef?.current])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const globalAverageNumber = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:[grid-template-columns:minmax(0,7fr)_minmax(0,3fr)] gap-x-6 w-full'

  const renderDashboard = useMemo(() => {
    switch (type) {
      case QuizAttemptChartType.ACCA: {
        if (!F_LOW_CODES.includes(subjectCode)) {
          return (
            <div className={commonMultipleScoreStyle}>
              <div className="flex max-h-full flex-col overflow-y-auto">
                <ChartACCAScore
                  data={chartData?.chart_data}
                  recommendation={questions?.quizAttempt?.attempt_gradings}
                />
                <ScoreDetail
                  className={'relative'}
                  yourScoreDetailRef={yourScoreDetailRef}
                  type={type}
                  gradingStatus={questions?.quizAttempt?.grading_status}
                />
              </div>
              <div className="-order-1 xl:order-1">
                <div className="max-h-full w-full pb-6 xl:sticky xl:top-[104px]">
                  <div
                    className={`flex h-[152px] w-full flex-wrap justify-between bg-white p-6 shadow-small xl:mb-6`}
                  >
                    <div className="mb-4 text-2xl font-bold text-ink-800">
                      {questions?.quizAttempt?.grading_status ===
                      GRADE_STATUS.FINISHED_GRADING
                        ? 'Overall Score'
                        : 'Multiple Choice Score'}
                    </div>
                    <div className="flex w-full items-end justify-between">
                      <div className={`mb-1 text-7xl font-bold text-primary`}>
                        {isNull(score) || isUndefined(score)
                          ? '--'
                          : Math.round(score)}
                        %
                      </div>
                      <GlobalAverage globalAverage={globalAverageNumber} />
                    </div>
                  </div>
                  <MultipleQuestion
                    questions={questions}
                    className={'xl:w-full'}
                    multipleQuestionRef={multipleQuestionRef}
                  />
                </div>
              </div>
            </div>
          )
        } else {
          return (
            <div className={commonMultipleScoreStyle}>
              <div className="xl:3/4 flex h-auto w-full flex-col">
                <ChartCMAScore
                  data={chartData?.chart_data}
                  globalAverage={globalAverageNumber}
                  score={score}
                  isGraded={
                    questions?.quizAttempt?.grading_status ===
                    GRADE_STATUS.FINISHED_GRADING
                  }
                  passingScore={chartData?.quiz?.required_percent_score}
                  recommendation={questions?.quizAttempt?.attempt_gradings}
                />
                <ScoreDetail
                  className={''}
                  yourScoreDetailRef={yourScoreDetailRef}
                  type={type}
                  gradingStatus={questions?.quizAttempt?.grading_status}
                />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'h-full'}
                multipleQuestionRef={multipleQuestionRef}
              />
            </div>
          )
        }
      }
      case 'CFA':
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="flex max-h-full flex-col">
              <MultipleChoiceScore
                chartData={chartData}
                recommendation={questions?.quizAttempt?.attempt_gradings}
                isGraded={
                  questions?.quizAttempt?.grading_status ===
                  GRADE_STATUS.FINISHED_GRADING
                }
                score={score}
              />
              <ScoreDetail
                className={''}
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
              />
            </div>
            <MultipleQuestion
              questions={questions}
              className={'xl:!h-[calc(100vh-241px)] xl:w-full'}
              multipleQuestionRef={multipleQuestionRef}
            />
          </div>
        )
      case QuizAttemptChartType.ENTRANCE_TEST:
      case QuizAttemptChartType.CMA:
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="xl:3/4 flex h-auto w-full flex-col">
              <ChartCMAScore
                data={chartData?.chart_data}
                globalAverage={globalAverageNumber}
                score={score}
                isGraded={
                  questions?.quizAttempt?.grading_status ===
                  GRADE_STATUS.FINISHED_GRADING
                }
                passingScore={chartData?.quiz?.required_percent_score}
                recommendation={questions?.quizAttempt?.attempt_gradings}
              />
              <ScoreDetail
                className={''}
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
              />
            </div>
            <div className="-order-1 xl:order-1">
              <div className="max-h-full w-full pb-6 xl:sticky xl:top-[104px]">
                <div
                  className={`w-full justify-between rounded-xl bg-white p-6 shadow-sidebar xl:mb-8`}
                >
                  <div className="mb-4 text-2xl font-bold text-ink-800">
                    {questions?.quizAttempt?.grading_status ===
                    GRADE_STATUS.FINISHED_GRADING
                      ? 'Overall Score'
                      : 'Multiple Choice Score'}
                  </div>
                  <div
                    className={`mb-1 font-inter text-7xl font-bold text-primary`}
                  >
                    {isNull(score) || isUndefined(score)
                      ? '--'
                      : `${Math.round(score)}%`}
                  </div>
                  <GlobalAverage globalAverage={globalAverageNumber} />
                  <div className="w-full">
                    {questions?.quizAttempt?.attempt_gradings.length > 0 &&
                      questions?.quizAttempt?.attempt_gradings?.map(
                        (item, index) => (
                          <Recommendation data={item} key={index} />
                        ),
                      )}
                  </div>
                </div>
                <MultipleQuestion
                  questions={questions}
                  className={'xl:w-full'}
                  multipleQuestionRef={multipleQuestionRef}
                />
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className={commonMultipleScoreStyle}>
            <div className="flex max-h-full flex-col overflow-y-auto">
              <ScoreDetail
                className={'relative'}
                yourScoreDetailRef={yourScoreDetailRef}
                type={type}
                gradingStatus={questions?.quizAttempt?.grading_status}
              />
            </div>
            <div className="-order-1 xl:order-1">
              <div className="max-h-full w-full pb-6 xl:sticky xl:top-[104px]">
                <div
                  className={`w-full justify-between rounded-xl bg-white p-6 shadow-sidebar xl:mb-8`}
                >
                  <div className="mb-4 text-2xl font-bold text-ink-800">
                    {questions?.quizAttempt?.grading_status ===
                    GRADE_STATUS.FINISHED_GRADING
                      ? 'Overall Score'
                      : 'Multiple Choice Score'}
                  </div>
                  <div
                    className={`mb-1 font-inter text-7xl font-bold text-primary`}
                  >
                    {isNull(score) || isUndefined(score)
                      ? '--'
                      : Math.round(score)}
                    %
                  </div>
                  <GlobalAverage globalAverage={globalAverageNumber} />
                  <div className="w-full">
                    {questions?.quizAttempt?.attempt_gradings.length > 0 &&
                      questions?.quizAttempt?.attempt_gradings?.map(
                        (item, index) => (
                          <Recommendation data={item} key={index} />
                        ),
                      )}
                  </div>
                </div>
                <MultipleQuestion
                  questions={questions}
                  className={'xl:w-full'}
                  multipleQuestionRef={multipleQuestionRef}
                />
              </div>
            </div>
          </div>
        )
    }
  }, [type, chartData, questions, score, globalAverageNumber, subjectCode])

  return <>{!!type ? renderDashboard : <SappLoading />}</>
}

export default TestResultPage
