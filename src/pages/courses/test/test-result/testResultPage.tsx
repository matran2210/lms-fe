import React, { useState } from 'react'
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
  courseDifficulty: number
}

const TestResultPage = ({
  questions,
  type,
  chartData,
  courseDifficulty,
}: IProps) => {
  const highestValue = roundNumber(
    (chartData?.correct_answer / chartData?.total_question) * 100,
  )
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)
  return (
    <>
      {type === 'ACCA' && courseDifficulty <= 4 ? (
        <div className="flex xl:gap-6 overflow-y-auto flex-wrap">
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
              className={'xl:h-[815px]'}
            />
          </div>
          <div className="max-h-full w-full xl:w-auto">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail />
          </div>
        </div>
      ) : (
        <>
          {type === 'CFA' ? (
            <div className="flex gap-6 overflow-y-auto flex-wrap">
              <div className="max-h-full w-full xl:w-auto">
                <YourScore chartData={chartData} />
                <YourScoreDetail />
              </div>
              <MultipleQuestion
                questions={questions}
                className={'xl:h-[991px]'}
              />
            </div>
          ) : (
            <div className="flex gap-6 overflow-y-auto flex-wrap">
              <MultipleQuestion
                questions={questions}
                className={'xl:h-[991px]'}
              />
              <div className="max-h-full w-full xl:w-auto">
                <YourScoreDetail />
              </div>
            </div>
          )}
        </>
      )}
    </>
  )
}

export default TestResultPage
