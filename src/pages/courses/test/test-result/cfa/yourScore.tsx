import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ChartCFAScore from './chartCFAScore'
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
  chartData: DataItem
}

const YourScore = ({ chartData }: IProps) => {
  const highestValue = roundNumber(
    (chartData?.correct_answer / chartData?.total_question) * 100,
  )
  const GlobalAverage = roundNumber(chartData?.quiz_report?.ratio ?? 0)
  return (
    <div className="mb-4 w-full max-w-full items-start bg-white p-6 shadow-sidebar xl:mb-6 xl:px-24">
      <TotalScore
        score={highestValue}
        globalAverage={GlobalAverage}
        classGlobal="mt-15 xl:pr-0"
      />
      <div className="block w-full">
        <ChartCFAScore data={chartData?.chart_data} />
      </div>
    </div>
  )
}

export default YourScore
