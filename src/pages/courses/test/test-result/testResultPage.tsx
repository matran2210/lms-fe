import { F_LOW_CODES } from '@utils/constants'
import { roundNumber } from '@utils/helpers'
import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'
import SappLoading from 'src/common/SappLoading'
import {
  IQuizAttempt,
  IQuizAttemptChartType,
  QuizAttemptChart,
  QuizAttemptChartType,
} from 'src/type'
import ChartACCAScore from './acca/chartACCAScore'
import Annotation from './Annotation'
import MultipleChoiceScore from './cfa/MultipleChoiceScore'
import ChartCMAScore from './cma/chartCMAScore'
import MultipleQuestion from './multipleQuestion'
import ScoreDetail from './ScoreDetail'
import { GRADE_STATUS } from 'src/constants'
import Recommendation from '@components/test/Recommendation'
import { isUndefined, isNull } from 'lodash'

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

  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:grid-cols-test-result gap-x-6 w-full'

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
              <div className="-order-1 mb-4 xl:order-1">
                <div className="max-h-full w-full xl:sticky xl:top-6 ">
                  <div
                    className={`$ flex h-[152px] w-full flex-wrap justify-between bg-white p-6 shadow-sidebar xl:mb-6`}
                  >
                    <div className="mb-5 text-xl font-semibold text-bw-1 xl:font-medium">
                      {questions?.quizAttempt?.grading_status ===
                      GRADE_STATUS.FINISHED_GRADING
                        ? 'Overall Score'
                        : 'Multiple Choice Score'}
                    </div>
                    <div className="flex w-full items-end justify-between">
                      <div
                        className={`font-inter text-6xl font-bold text-primary xl:text-6xl`}
                      >
                        {isNull(score) || isUndefined(score)
                          ? '--'
                          : Math.round(score)}
                        %
                      </div>
                      <div className={`mb-3 flex items-center gap-1`}>
                        <Image
                          src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
                          width={16}
                          height={16}
                          alt="Globe"
                        />
                        <div className={`text-sm leading-4.9 text-gray-1`}>
                          Global Average {GlobalAverage}%
                        </div>
                      </div>
                    </div>
                  </div>
                  <MultipleQuestion
                    questions={questions}
                    className={'xl:w-full'}
                    multipleQuestionRef={multipleQuestionRef}
                    setOpenAnnotaion={setOpenAnnotaion}
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
                  GlobalAverage={GlobalAverage}
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
                setOpenAnnotaion={setOpenAnnotaion}
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
              setOpenAnnotaion={setOpenAnnotaion}
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
                GlobalAverage={GlobalAverage}
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
              setOpenAnnotaion={setOpenAnnotaion}
            />
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
            <div className="order-1 mb-4 xl:order-1">
              <div className="max-h-full w-full xl:sticky xl:top-6 ">
                <div
                  className={`flex min-h-[152px] w-full flex-wrap justify-between bg-white p-6 shadow-sidebar xl:mb-6`}
                >
                  <div className="mb-5 text-xl font-semibold text-bw-1 xl:font-medium">
                    {questions?.quizAttempt?.grading_status ===
                    GRADE_STATUS.FINISHED_GRADING
                      ? 'Overall Score'
                      : 'Multiple Choice Score'}
                  </div>
                  <div className="flex w-full flex-wrap items-end justify-between">
                    <div
                      className={`mb-[13px] font-inter text-6xl font-bold text-primary xl:text-6xl`}
                    >
                      {isNull(score) || isUndefined(score)
                        ? '--'
                        : Math.round(score)}
                      %
                    </div>
                    <div className={`flex items-center gap-1`}>
                      <Image
                        src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
                        width={16}
                        height={16}
                        alt="Globe"
                      />
                      <div className={`text-sm leading-4.9 text-gray-1`}>
                        Global Average {GlobalAverage}%
                      </div>
                    </div>
                  </div>
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
                  setOpenAnnotaion={setOpenAnnotaion}
                />
              </div>
            </div>
          </div>
        )
    }
  }, [type, score])

  return (
    <>
      {!!type ? renderDashboard : <SappLoading />}
      <Annotation
        gradingStatus={questions?.quizAttempt?.grading_status}
        openAnnotaion={openAnnotaion}
        setOpenAnnotaion={setOpenAnnotaion}
      />
    </>
  )
}

export default TestResultPage
