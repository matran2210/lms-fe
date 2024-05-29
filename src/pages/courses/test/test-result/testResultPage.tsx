import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import YourScore from './cfa/yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQues'
import ChartACCAScore from './acca/chartACCAScore'
import TotalScore from '@components/mycourses/test/TotalScore'
import { roundNumber } from '@utils/helpers'
import { F_LOW_CODES } from '@utils/constants'

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

  useEffect(() => {
    const multipleQuestionElem = multipleQuestionRef?.current
    const yourScoreDetailElem = yourScoreDetailRef?.current
    if (multipleQuestionElem && yourScoreDetailElem) {
      const maxHeight = Math.max(
        multipleQuestionElem.offsetHeight,
        yourScoreDetailElem.offsetHeight,
      )
      multipleQuestionElem.style.height = `calc(100vh - ${maxHeight}px)`
      yourScoreDetailElem.style.height = `calc(100vh - ${maxHeight}px)`
    }
  }, [multipleQuestionRef?.current, yourScoreDetailRef?.current])

  const highestValue = roundNumber(
    (chartData?.correct_answer / chartData?.total_question) * 100,
  )
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)

  return (
    <>
      {type === 'ACCA' && F_LOW_CODES.includes(subjectCode) ? (
        <div className="flex xl:gap-6 flex-wrap">
          <div className="max-h-full w-full xl:max-w-smd">
            <TotalScore
              score={highestValue}
              className="mb-4 pt-6 pb-5 px-[27px] shadow-sidebar"
              classScore="pt-2"
              classGlobal="mt-3 mb-3.5 !items-end"
              classCountAll="relative top-0.5"
              globalAverage={GlobalAverage}
            />
            <MultipleQuestion
              questions={questions}
              className={'xl:min-h-[815px]'}
              multipleQuestionRef={multipleQuestionRef}
            />
          </div>
          <div className="max-h-full w-full xl:w-auto">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail
              className={'min-h-[815px] 2xl-max:pb-10'}
              yourScoreDetailRef={yourScoreDetailRef}
            />
          </div>
        </div>
      ) : (
        <>
          {type === 'CFA' ? (
            <div className="flex gap-6 flex-wrap">
              <div className="max-h-full w-full xl:w-auto">
                <YourScore chartData={chartData} />
                <YourScoreDetail
                  className={'min-h-[466px] 2xl-max:pb-10'}
                  yourScoreDetailRef={yourScoreDetailRef}
                />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'xl:min-h-[991px]'}
                multipleQuestionRef={multipleQuestionRef}
              />
            </div>
          ) : (
            <div className="flex gap-6 flex-wrap">
              <MultipleQuestion
                questions={questions}
                className={'xl:min-h-[991px]'}
                multipleQuestionRef={multipleQuestionRef}
              />
              <div className="max-h-full w-full xl:w-auto">
                <YourScoreDetail
                  className={'min-h-[991px] 2xl-max:pb-10'}
                  yourScoreDetailRef={yourScoreDetailRef}
                />
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TestResultPage
