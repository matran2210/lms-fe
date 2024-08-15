import React, { useEffect, useRef, useState } from 'react'
import YourScore from './cfa/yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQuestion'
import ChartACCAScore from './acca/chartACCAScore'
import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { F_LOW_CODES } from '@utils/constants'
import SappLoading from 'src/common/SappLoading'
import ChartCMAScore from './cma/chartCMAScore'
import Annotation from './Annotation'
import { isNaN } from 'lodash'
import Image from 'next/image'
import { IQuizAttemptChartType } from 'src/type'

interface QuizReport {
  ratio: number
}

export interface Quiz {
  id: string
  quiz_type: string
  is_graded: boolean
  required_percent_score: number
  course_category_id: any
  subject_id: any
}

interface DataItem {
  chart_data: any
  chart_type: string
  correct_answer: number
  total_question: number
  quiz_report: QuizReport
  quiz: Quiz
}

interface IProps {
  questions: Object
  type: IQuizAttemptChartType
  chartData: DataItem
  subjectCode: string
}

const TestResultPage = ({
  questions,
  type,
  chartData,
  subjectCode,
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
          ? '0px'
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

  const calculateHighestValue = isNaN(
    chartData?.correct_answer / chartData?.total_question,
  )
    ? 0
    : chartData?.correct_answer / chartData?.total_question
  const highestValue = roundNumber(calculateHighestValue * 100)
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:grid-cols-test-result gap-x-6 w-full'

  return (
    <>
      {type === 'ACCA' && F_LOW_CODES.includes(subjectCode) ? (
        <div className={commonMultipleScoreStyle}>
          <div className="flex max-h-full flex-col overflow-y-auto">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail
              className={'relative'}
              yourScoreDetailRef={yourScoreDetailRef}
              type={type}
            />
          </div>
          <div className="-order-1 mb-4 xl:order-1">
            <div className="max-h-full w-full xl:sticky xl:top-6 ">
              <div
                className={`$ flex h-[152px] w-full flex-wrap justify-between bg-white p-6 shadow-sidebar xl:mb-6`}
              >
                <div className="mb-5 text-xl font-semibold text-bw-1 xl:font-medium">
                  Multiple Choice Score
                </div>
                <div className="flex w-full items-end justify-between">
                  <div
                    className={`$ -mb-[13px] font-inter text-6xl font-bold text-primary xl:text-6xl`}
                  >
                    <>{Math.floor(highestValue as number)}%</>
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
      ) : (
        <>
          {type === 'CFA' ? (
            <div className={commonMultipleScoreStyle}>
              <div className="flex max-h-full flex-col">
                <YourScore chartData={chartData} />
                <YourScoreDetail
                  className={''}
                  yourScoreDetailRef={yourScoreDetailRef}
                  type={type}
                />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'xl:!h-[calc(100vh-241px)] xl:w-full'}
                multipleQuestionRef={multipleQuestionRef}
                setOpenAnnotaion={setOpenAnnotaion}
              />
            </div>
          ) : (
            <>
              {type !== undefined ? (
                <div className={commonMultipleScoreStyle}>
                  <div className="xl:3/4 flex h-auto w-full flex-col">
                    <ChartCMAScore
                      data={chartData?.chart_data}
                      GlobalAverage={GlobalAverage}
                      score={highestValue}
                      isGraded={chartData?.quiz?.is_graded}
                      passingScore={chartData?.quiz?.required_percent_score}
                    />
                    <YourScoreDetail
                      className={''}
                      yourScoreDetailRef={yourScoreDetailRef}
                      type={type}
                    />
                  </div>
                  <MultipleQuestion
                    questions={questions}
                    className={'h-full'}
                    multipleQuestionRef={multipleQuestionRef}
                    setOpenAnnotaion={setOpenAnnotaion}
                  />
                </div>
              ) : (
                <SappLoading />
              )}
            </>
          )}
        </>
      )}
      <Annotation
        openAnnotaion={openAnnotaion}
        setOpenAnnotaion={setOpenAnnotaion}
      />
    </>
  )
}

export default TestResultPage
