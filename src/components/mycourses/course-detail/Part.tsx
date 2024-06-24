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
import { ANIMATION } from 'src/constants'
import { trackGAEvent } from '@utils/google-analytics'
import SappTooltip from 'src/common/SappTooltip'

const CLICK_NAME_COURSE_DETAIL = 'Click Name Course Detail'
const CLICK_BUTTON_COURSE_DETAIL = 'Click Button Course Detail'

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

  const progressPart = percentProgress > 100 ? 100 : percentProgress

  return (
    <div data-aos={ANIMATION.DATA_AOS}>
      <div
        className={`name-course text-2xl font-medium xl:h-[60px] text-bw-1`}
        onClick={() => {
          course?.course_section_type === 'PART' ? onClickPart(course?.id) : {}
          trackGAEvent(
            CLICK_NAME_COURSE_DETAIL,
            CLICK_NAME_COURSE_DETAIL,
            CLICK_NAME_COURSE_DETAIL,
          )
        }}
      >
        <div className="line-clamp-2 text-ellipsis cursor-pointer ">
          <SappTooltip
            title={course?.name}
            showTooltip={(course?.name as string)?.length > 40}
          >
            {truncateString(course?.name, 40)}
          </SappTooltip>
        </div>
      </div>
      <div className="des mt-6 mb-15">
        <div className="line-clamp-5 text-ellipsis h-[120px]">
          <SappTooltip
            title={
              <p
                dangerouslySetInnerHTML={{
                  __html: course?.description,
                }}
              />
            }
            showTooltip={(course?.description as string)?.length > 250}
          >
            <p
              dangerouslySetInnerHTML={{
                __html: course?.description,
              }}
              className="text-base h-[120px] text-bw-1"
            />
          </SappTooltip>
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
                {progressPart}%
              </p>
            </div>
          </div>
          <div className="progressbar bg-gray-3 h-1.5">
            <div
              className="progress-percentage bg-primary h-1.5"
              style={{ width: `${progressPart}%` }}
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
            onClick={() => {
              course?.course_section_type === 'PART'
                ? onClickPart(course.id)
                : {}
              trackGAEvent(
                CLICK_BUTTON_COURSE_DETAIL,
                CLICK_BUTTON_COURSE_DETAIL,
                CLICK_BUTTON_COURSE_DETAIL,
              )
            }}
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
