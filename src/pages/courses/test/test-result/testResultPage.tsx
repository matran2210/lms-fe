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

interface CourseDifficulty {
  course_difficulty: number
}

interface DataItem {
  chart_data: any
  chart_type: string
  correct_answer: number
  total_question: number
  quiz_report: QuizReport
  course: CourseDifficulty
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
      {type === 'CFA' && (
        <div className="flex gap-6 overflow-y-auto flex-wrap">
          <div className="max-h-full">
            <YourScore chartData={chartData} />
            <YourScoreDetail />
          </div>
          <MultipleQuestion questions={questions} className={'h-[991px]'} />
        </div>
      )}
      {type === 'ACCA' && courseDifficulty <= 4 ? (
        <div className="flex gap-6 overflow-y-auto flex-wrap">
          <div className="max-h-full w-full max-w-smd">
            <TotalScore
              score={highestValue}
              className="px-7 pt-6 pb-4 mb-5 shadow-sidebar"
              classScore="pt-2"
              classGlobal="mt-0 mb-3 !items-end"
              classCountAll="relative top-0.5"
              globalAverage={GlobalAverage}
            />
            <MultipleQuestion questions={questions} className={'h-[815px]'} />
          </div>
          <div className="max-h-full">
            <ChartACCAScore data={chartData?.chart_data} />
            <YourScoreDetail />
          </div>
        </div>
      ) : (
        <div className="flex gap-6 overflow-y-auto flex-wrap">
          <MultipleQuestion questions={questions} className={'h-[991px]'} />
          <div className="max-h-full">
            <YourScoreDetail />
          </div>
        </div>
      )}
    </>
  )
}

export default TestResultPage
