import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ChartScore from './chartScore'

interface DataItem {
  chart_data: any
  chart_type: string
  correct_answer: number
  total_question: number
}

interface IProps {
  chartData: DataItem
}

const YourScore = ({ chartData }: IProps) => {
  const highestValue =
    (chartData?.correct_answer / chartData?.total_question) * 100
  return (
    <div className="bg-white max-w-[1144px] items-start px-4 lg:px-24 py-6">
      <div className="flex flex-row justify-between w-full mb-6">
        <div className="block">
          <div className="text-xl font-bold leading-6.2 text-bw-1">
            Your Score
          </div>
          <div className="text-6px font-bold text-primary mt-2">
            {highestValue}%
          </div>
        </div>
        <div className="flex flex-row mt-16 gap-1 w-fit items-start">
          <img
            src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
            alt="Globe"
            id="Globe"
            className="w-4"
          />
          <div className="text-base leading-4.9 text-gray-1">
            Global Average 79%
          </div>
        </div>
      </div>
      <div className="block w-full">
        <div className="text-xl font-bold leading-6.2 text-bw-1 ml-px mb-6">
          Your Performance by Topic Area
        </div>
        <ChartScore data={chartData?.chart_data} />
      </div>
    </div>
  )
}

export default YourScore
