import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import TestModal from 'src/pages/courses/test'
import { round } from 'lodash'
import { useRouter } from 'next/router'

interface IProps {
  courses: any
}

const Part = ({ courses }: IProps) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const percentProgress = round(
    (courses?.learning_progress?.total_course_sections_completed /
      courses?.learning_progress?.total_course_sections) *
      100,
    2,
  )

  const onClickPart = (id: string) => {
    router.push(`/courses/${router.query.courseId}/section/${id}`)
  }

  return (
    <div onClick={() => onClickPart(courses?.id)} className="cursor-pointer">
      <div className={`name-part text-2xl font-semibold`}>{'name'}</div>
      <div className="des mt-6 mb-15">
        <p className={`text-base`}>{'description'}</p>
      </div>
      <div className="mt-auto">
        <div className="progress mb-6">
          <div className="info flex justify-between mb-2">
            <div className="text flex items-baseline">
              <Icon type={'hour'} className="relative top-0.5" />
              <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                In Progress
              </p>
              <span className="text-medium-sm font-medium text-gray-1 pl-1 ml-px">
                16h15m left
              </span>
            </div>
            <div className="number">
              <p className="text-medium-sm font-medium text-bw-1">
                {percentProgress}%
              </p>
            </div>
          </div>
          <div className="progressbar bg-gray-3 h-1.5">
            <div
              className="progress-percentage bg-primary h-1.5"
              style={{ width: `${percentProgress}%` }}
            ></div>
          </div>
        </div>
        <div className="action flex items-center jusity-end relative">
          <ButtonSecondary
            title={
              percentProgress === 0
                ? 'Begin'
                : percentProgress === 100
                ? 'Review'
                : 'Resume'
            }
            full={false}
            size={'small'}
            className="hover:bg-primary hover:text-white ml-auto"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>
      {/* Solution test modal */}
      {/* <SolutionModal open={open} setOpen={setOpen} /> */}
      <TestModal open={open} setOpen={setOpen} title={''} />
    </div>
  )
}

export default Part
