import React, { useEffect, useRef, useState } from 'react'
import YourScore from './cfa/yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQues'
import ChartACCAScore from './acca/chartACCAScore'
import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { F_LOW_CODES } from '@utils/constants'
import SappLoading from 'src/common/SappLoading'
import ChartCMAScore from './cma/chartCMAScore'
import Annotation from './Annotation'

interface QuizReport {
  ratio: number
}

interface DataItem {
  chart_data: any
  chart_type: string
  correct_answer: number
  total_question: number
  quiz_report: QuizReport
}

interface IProps {
  questions: Object
  type: string
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

  const highestValue = roundNumber(
    (chartData?.correct_answer / chartData?.total_question) * 100,
  )
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  const commonMultipleScoreStyle =
    'grid grid-cols-1 xl:grid-cols-test-result gap-x-6 w-full'
  return (
    <>
      {type === 'ACCA' && F_LOW_CODES.includes(subjectCode) ? (
        <div className={commonMultipleScoreStyle}>
          <div className="flex max-h-full flex-col">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail
              className={'relative'}
              yourScoreDetailRef={yourScoreDetailRef}
            />
          </div>
          <div className="max-h-full w-full xl:w-full">
            <TotalScore
              score={highestValue}
              className="mb-4 h-[152px] px-[27px] pb-5 pt-6 shadow-sidebar"
              classScore="pt-2"
              classGlobal="mt-3 mb-3.5 !items-end"
              classCountAll="relative top-0.5"
              globalAverage={GlobalAverage}
            />
            <MultipleQuestion
              questions={questions}
              className={'xl:min-h-[635px]'}
              multipleQuestionRef={multipleQuestionRef}
              setOpenAnnotaion={setOpenAnnotaion}
            />
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
                />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'xl:w-full'}
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
                    />
                    <YourScoreDetail
                      className={''}
                      yourScoreDetailRef={yourScoreDetailRef}
                    />
                  </div>
                  <MultipleQuestion
                    questions={questions}
                    className={'h-full xl:w-full'}
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
