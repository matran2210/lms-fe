import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import YourScore from './yourScore'
import YourScoreDetail from './yourScoreDetail'
import MultipleQuestion from './multipleQues'

interface DataItem {
  chart_data: any
  chart_type: string
  correct_answer: number
  total_question: number
}

interface IProps {
  questions: Object
  chartData: DataItem
}

const TestResultPage = ({ questions, chartData }: IProps) => {
  return (
    <div className="grid grid-flow-col gap-4 overflow-y-auto">
      <div className="col-span-2 ">
        <YourScore chartData={chartData} />
      </div>
      <div className="row-span-2 col-span-2 max-h-full">
        <YourScoreDetail />
      </div>
      <div className="row-span-3 ">
        <MultipleQuestion questions={questions} />
      </div>
    </div>
  )
}

export default TestResultPage
