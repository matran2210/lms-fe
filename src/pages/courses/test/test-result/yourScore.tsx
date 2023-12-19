import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import Chart from './chartScore'

interface CoursesProps {
  courses: any[]
}
const TopicArea = [
  { id: 1, title: 'abc', value: 30, topicW: '4%' },
  { id: 2, title: 'def', value: 50, topicW: '4%' },
  { id: 3, title: 'abc', value: 40, topicW: '4%' },
  { id: 4, title: 'abc', value: 60, topicW: '4%' },
  { id: 5, title: 'abc', value: 35, topicW: '4%' },
  { id: 6, title: 'abc', value: 40, topicW: '4%' },
  // ...
]
const YourScore: React.FC = () => {
  const highestValue = Math.max(...TopicArea.map((item) => item.value))
  return (
    <div className="bg-white flex flex-col justify-center gap-10 max-w-full items-start px-4 lg:px-24 py-6">
      <div className="flex flex-row justify-between ml-px w-full items-start">
        <div className="flex flex-col gap-6 w-1/6 items-start">
          <div className="text-xl font-bold leading-6.2 text-bw-1">
            Your Score
          </div>
          <div className="text-[64px] font-bold leading-[76.8px] text-primary">
            {highestValue}%
          </div>
        </div>
        <div className="flex flex-row mt-16 gap-1 w-1/6 items-start">
          <img
            src="https://file.rendit.io/n/XnLyBdd8onI3Zbp3i20X.svg"
            alt="Globe"
            id="Globe"
            className="w-4"
          />
          <div className="leading-[19.2px] text-gray-1 text-sm mt-px">
            Global Average 79%
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 max-w-[950px] items-start">
        <div className="text-xl font-bold eading-6.2 text-bw-1 ml-px">
          Your Performance by Topic Area
        </div>
        <div className="p-4">
          <Chart data={TopicArea} />
        </div>
        <div>
          <div className="bg-gray-4 px-6 py-3  ">
            <div className="flex flex-row gap-8">
              <div className="flex flex-col gap-8">
                <div className="min-w-[86px] text-sm text-center mt-6">
                  Topic Area
                </div>
                <div className="min-w-[86px] text-sm text-center mt-5">
                  Topic Weight
                </div>
              </div>
              {TopicArea.map((item) => (
                <div key={item.id} className="flex flex-col w-1/4 items-start">
                  <div className="mr-10 ml-10 my-6 text-bw-1 font-medium">
                    {item.title}
                  </div>
                  <div className="mx-11 my-6 text-gray-400 font-normal">
                    {item.topicW}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourScore
