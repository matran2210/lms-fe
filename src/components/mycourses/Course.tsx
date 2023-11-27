import React, { useState } from 'react'
import Link from 'next/link'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
interface CourseProps {
  name: string
  active: boolean
  showInfo: boolean
  path: string
  className?: string
  time: number
  des: string
  progressText?: string
  progressIconType?: string
  percentage?: number
  changeExam?: string
  buttonText: string
}

const Course = ({
  name,
  active,
  showInfo,
  path,
  className,
  time,
  des,
  progressText,
  progressIconType,
  percentage,
  changeExam,
  buttonText,
}: CourseProps) => {
  return (
    <>
      <div
        className={`name-course text-2xl font-semibold mb-4 ${
          active ? 'text-bw-1' : 'text-gray-2'
        }`}
      >
        <Link href={`/courses/my-course/${path}`}>{name}</Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="name-class text-medium-sm text-gray-1">
          Class:
          <span className="ml-1 text-bw-1 font-medium">{className}</span>
        </div>
        {showInfo && (
          <div className="time-class text-medium-sm text-gray-1">
            {time == 0 ? (
              <span>
                <span className="font-medium">0</span> day left
              </span>
            ) : (
              <span>
                <span className="font-semibold text-bw-1">{time}</span>
                days left
              </span>
            )}
          </div>
        )}
      </div>
      <div className="des mt-6 mb-8">
        <p className={`text-base ${active ? 'text-bw-1' : 'text-gray-1'}`}>
          {des}
        </p>
      </div>
      <div className="mt-auto">
        {active && (
          <div className="progress mb-6">
            <div className="info flex justify-between mb-2">
              <div className="text flex items-baseline">
                <Icon type={progressIconType} className="relative top-0.5" />
                <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                  {progressText}
                </p>
              </div>
              <div className="number">
                <p className="text-medium-sm font-medium text-bw-1">
                  {percentage}%
                </p>
              </div>
            </div>
            <div className="progressbar bg-gray-3 h-1.5">
              <div
                className="progress-percentage bg-primary h-1.5"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        )}
        <div className="action flex items-center jusity-between relative">
          {changeExam && (
            <a className="underline capitalize block text-bw-1 text-medium-sm font-semibold">
              {changeExam}
            </a>
          )}
          {buttonText && (
            <ButtonSecondary
              title={buttonText}
              full={false}
              size={'small'}
              className="hover:bg-primary hover:text-white ml-auto"
            />
          )}
        </div>
      </div>
    </>
  )
}

export default Course
