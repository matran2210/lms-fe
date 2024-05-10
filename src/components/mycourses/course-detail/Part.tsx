import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import TestModal from 'src/pages/courses/test'
import { round, truncate } from 'lodash'
import { useRouter } from 'next/router'
import { countWords, formatTime, truncateString } from '@utils/index'
import {
  ICourseSection,
  CLASS_USER_STATUS,
  ICourseDetail,
  IMyCourseDetail,
} from 'src/type/courses'
import { useForm } from 'react-hook-form'
import { Tooltip } from 'antd'

const Part = ({ course }: { course: IMyCourseDetail }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const percentProgress = round(
    (course?.learning_progress?.total_course_sections_completed /
      course?.learning_progress?.total_course_sections) *
      100,
    2,
  )

  const onClickPart = (id: string) => {
    router.push(`/courses/${router.query.courseId}/section/${id}`)
  }

  const formattedTime = Number(
    formatTime(
      course?.learning_progress?.duration -
        course?.learning_progress?.time_spent || 0,
    ),
  )

  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as any

  const showStatus = statusMap[course?.user_section_learning_status || '']

  const renderStatusIcon = (status: string) => {
    switch (status) {
      case `${CLASS_USER_STATUS.READY_TO_LEARN}`:
        return 'like'
        break
      case `${CLASS_USER_STATUS.IN_PROGRESS}`:
        return 'hour'
        break
      case `${CLASS_USER_STATUS.COMPLETED}`:
        return 'completed'
        break
      default:
        return ''
    }
  }
  const iconType = renderStatusIcon(course?.user_section_learning_status ?? '')

  return (
    <div>
      <div
        className={`name-part text-2xl font-medium h-[60px] cursor-pointer`}
        onClick={() =>
          course?.course_section_type === 'PART' ? onClickPart(course?.id) : {}
        }
      >
        {(course?.name as string)?.length > 50 ? (
          <Tooltip title={course?.name} color="#ffffff" placement="top">
            {truncateString(course?.name, 50)}
          </Tooltip>
        ) : (
          <>{course?.name}</>
        )}
      </div>
      <div className="des mt-6 mb-15">
        <div className="line-clamp-5 text-ellipsis h-[120px]">
          {(course?.description as string)?.length > 250 ? (
            <Tooltip
              title={
                <p
                  dangerouslySetInnerHTML={{
                    __html: course?.description,
                  }}
                />
              }
              color="#ffffff"
              placement="bottom"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: course?.description,
                }}
                className="text-base h-[120px] text-bw-1"
              />
            </Tooltip>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: course?.description,
              }}
              className="text-base h-[120px] text-bw-1"
            />
          )}
        </div>
      </div>
      <div className="mt-auto">
        <div className="progress mb-6">
          <div className="info flex justify-between mb-2">
            <div className="text flex items-end">
              <Icon type={`${iconType}`} />
              <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px leading-[14px]">
                {showStatus}
              </p>
              <span className="text-medium-sm font-medium text-gray-1 pl-1 ml-px">
                {formattedTime > 0 ? `${formattedTime} left` : ''}
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
            className="ml-auto"
            onClick={() =>
              course?.course_section_type === 'PART'
                ? onClickPart(course.id)
                : {}
            }
          />
        </div>
      </div>
      {/* Solution test modal */}
      {/* <SolutionModal open={open} setOpen={setOpen} /> */}
      {/* <TestModal open={open} setOpen={setOpen} title={''} /> */}
    </div>
  )
}

export default Part
