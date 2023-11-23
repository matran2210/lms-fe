import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'

interface Course {
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

interface CoursesProps {
  courses: Course[]
}

const Courses: React.FC<CoursesProps> = ({ courses }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map((course, index) => (
        <div
          key={index}
          className={`item bg-white p-[30px] shadow-sidebar flex flex-col`}
        >
          <div
            className={`name-course text-2xl font-semibold mb-4 ${
              course.active ? 'text-bw-1' : 'text-gray-2'
            }`}
          >
            <Link href={`/courses/my-course/${course.path}`}>
              {course.name}
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <div className="name-class text-medium-sm text-gray-1">
              Class:
              <span className="ml-1 text-bw-1 font-medium">
                {course.className}
              </span>
            </div>
            {course.showInfo && (
              <div className="time-class text-medium-sm text-gray-1">
                {course.time == 0 ? (
                  <span>
                    <span className="font-medium">0</span> day left
                  </span>
                ) : (
                  <span>
                    <span className="font-semibold text-bw-1">
                      {course.time}
                    </span>
                    days left
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="des mt-6 mb-8">
            <p
              className={`text-base ${
                course.active ? 'text-bw-1' : 'text-gray-1'
              }`}
            >
              {course.des}
            </p>
          </div>
          <div className="mt-auto">
            {course.active && (
              <div className="progress mb-6">
                <div className="info flex justify-between mb-2">
                  <div className="text flex items-baseline">
                    <Icon
                      type={course.progressIconType}
                      className="relative top-0.5"
                    />
                    <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                      {course.progressText}
                    </p>
                  </div>
                  <div className="number">
                    <p className="text-medium-sm font-medium text-bw-1">
                      {course.percentage}%
                    </p>
                  </div>
                </div>
                <div className="progressbar bg-gray-3 h-1.5">
                  <div
                    className="progress-percentage bg-primary h-1.5"
                    style={{ width: `${course.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="action flex items-center jusity-between relative">
              {course.changeExam && (
                <a className="underline capitalize block text-bw-1 text-medium-sm font-semibold">
                  {course.changeExam}
                </a>
              )}
              {course.buttonText && (
                <ButtonSecondary
                  title={course.buttonText}
                  full={false}
                  size={'small'}
                  className="hover:bg-primary hover:text-white ml-auto"
                />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Courses
