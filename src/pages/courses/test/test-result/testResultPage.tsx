import React, { useEffect, useRef, useState } from 'react'
import YourScore from './cfa/yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQues'
import ChartACCAScore from './acca/chartACCAScore'
import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { F_LOW_CODES } from '@utils/constants'
import SappLoading from 'src/common/SappLoading'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { CloseIcon } from '@assets/icons'
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

  return (
    <>
      {type === 'ACCA' && F_LOW_CODES.includes(subjectCode) ? (
        <div className="flex xl:gap-6 flex-wrap">
          <div className="max-h-full w-full xl:w-auto flex flex-col">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail
              className={'min-h-[635px] 2xl-max:pb-10 grow'}
              yourScoreDetailRef={yourScoreDetailRef}
            />
          </div>
          <div className="max-h-full w-full xl:max-w-smd">
            <TotalScore
              score={highestValue}
              className="mb-4 pt-6 pb-5 px-[27px] shadow-sidebar h-[152px]"
              classScore="pt-2"
              classGlobal="mt-3 mb-3.5 !items-end"
              classCountAll="relative top-0.5"
              globalAverage={GlobalAverage}
            />
            <MultipleQuestion
              questions={questions}
              className={'3.75xl:min-h-[635px]'}
              multipleQuestionRef={multipleQuestionRef}
              setOpenAnnotaion={setOpenAnnotaion}
            />
          </div>
        </div>
      ) : (
        <>
          {type === 'CFA' ? (
            <div className="flex gap-6 flex-wrap">
              <div className="max-h-full w-full xl:w-auto flex flex-col">
                <YourScore chartData={chartData} />
                <YourScoreDetail
                  className={'min-h-[180px] grow 2xl-max:pb-10'}
                  yourScoreDetailRef={yourScoreDetailRef}
                />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'3.75xl:min-h-[820px]'}
                multipleQuestionRef={multipleQuestionRef}
                setOpenAnnotaion={setOpenAnnotaion}
              />
            </div>
          ) : (
            <>
              {type !== undefined ? (
                <div className="flex xl:gap-6 flex-wrap">
                  <div className="h-auto w-full xl:w-auto flex flex-col">
                    <ChartCMAScore
                      data={chartData?.chart_data}
                      GlobalAverage={GlobalAverage}
                      score={highestValue}
                    />
                    <YourScoreDetail
                      className={'min-h-[250px] 2xl-max:pb-10'}
                      yourScoreDetailRef={yourScoreDetailRef}
                    />
                  </div>
                  <MultipleQuestion
                    questions={questions}
                    className={'3.75xl:min-h-[820px]'}
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
