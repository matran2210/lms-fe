import React, { useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import TestModal from 'src/pages/courses/test'
import { round, truncate } from 'lodash'
import { useRouter } from 'next/router'
import { countWords, formatTime, truncateString } from '@utils/index'
import { ICourseSection, CLASS_USER_STATUS } from 'src/type/courses'
import { useForm } from 'react-hook-form'
import { Tooltip } from 'antd'

const Part = ({ courses }: { courses: ICourseSection }) => {
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

  const formattedTime = formatTime(courses?.remaining_time || 0)

  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as any

  const showStatus = statusMap[courses?.user_section_learning_status || '']

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
  const iconType = renderStatusIcon(courses?.user_section_learning_status ?? '')

  return (
    <div
      onClick={() =>
        courses?.course_section_type === 'PART' ? onClickPart(courses?.id) : {}
      }
      className="cursor-pointer"
    >
      <div className={`name-part text-2xl font-medium h-[60px]`}>
        {(courses?.name as string)?.length > 50 ? (
          <Tooltip title={courses?.name} color="#ffffff" placement="top">
            {truncateString(courses?.name, 50)}
          </Tooltip>
        ) : (
          <>{courses?.name}</>
        )}
      </div>
      <div className="des mt-6 mb-15">
        <div className="line-clamp-5 text-ellipsis h-[120px]">
          {(courses?.description as string).length > 250 ? (
            <Tooltip
              title={
                <p
                  dangerouslySetInnerHTML={{
                    __html: courses?.description,
                  }}
                />
              }
              color="#ffffff"
              placement="right"
            >
              <p
                dangerouslySetInnerHTML={{
                  __html: courses?.description,
                }}
                className="text-base h-[120px]"
              />
            </Tooltip>
          ) : (
            <p
              dangerouslySetInnerHTML={{
                __html: courses?.description,
              }}
              className="text-base h-[120px]"
            />
          )}
        </div>
      </div>
      <div className="mt-auto">
        <div className="progress mb-6">
          <div className="info flex justify-between mb-2">
            <div className="text flex items-baseline">
              <Icon type={`${iconType}`} className="relative top-0.5" />
              <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                {showStatus}
              </p>
              <span className="text-medium-sm font-medium text-gray-1 pl-1 ml-px">
                {formattedTime} left
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
            onClick={() =>
              courses?.course_section_type === 'PART'
                ? router.push(
                    `/courses/${router.query.courseId}/section/${courses.id}`,
                  )
                : setOpen(true)
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
