import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import Link from 'next/link'
import SappModal from '@components/base/modal/SappModal'
import TestModal from 'src/pages/courses/test'

interface IProps {
  name: string
  path: string
  des: string
  progressText?: string
  progressTimeStatus?: string
  progressIconType?: string
  percentage?: number
  buttonText: string
  pass: boolean
}

const Part = ({
  name,
  path,
  des,
  progressText,
  progressTimeStatus,
  progressIconType,
  percentage,
  buttonText,
  pass,
}: IProps) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className={`name-part text-2xl font-semibold`}>
        <Link href={`/courses/my-course/course-detail/${path}`}>{name}</Link>
      </div>
      <div className="des mt-6 mb-15">
        <p className={`text-base`}>{des}</p>
      </div>
      <div className="mt-auto">
        <div className="progress mb-6">
          <div className="info flex justify-between mb-2">
            <div className="text flex items-baseline">
              <Icon type={progressIconType} className="relative top-0.5" />
              <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                {progressText}
              </p>
              <span className="text-medium-sm font-medium text-gray-1 pl-1 ml-px">
                {progressTimeStatus}
              </span>
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
        <div className="action flex items-center jusity-end relative">
          {buttonText && (
            <ButtonSecondary
              title={buttonText}
              full={false}
              size={'small'}
              className="hover:bg-primary hover:text-white ml-auto"
              onClick={() => setOpen(true)}
            />
          )}
        </div>
      </div>
      <TestModal open={open} setOpen={setOpen} title={name} />
    </>
  )
}

export default Part
