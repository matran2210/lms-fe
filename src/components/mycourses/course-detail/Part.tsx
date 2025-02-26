import React from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { formatTime, truncateBySpace, truncateHTML } from '@utils/index'
import { CLASS_USER_STATUS, IMyCourseDetail } from 'src/type/courses'
import { ANIMATION } from 'src/constants'
import SappTooltip from 'src/common/SappTooltip'
import { trackGAEvent } from '@utils/google-analytics'
import toast from 'react-hot-toast'

const Part = ({ course }: { course: IMyCourseDetail }) => {
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

  const trackGAEventBasedOnProgress = (
    percentProgress: number,
  ): (() => void) => {
    if (percentProgress === 0) {
      return () => trackGAEvent('Button Begin Course Detail')
    } else if (percentProgress === 100) {
      return () => trackGAEvent('Button Review Course Detail')
    } else {
      return () => trackGAEvent('Button Resume Course Detail')
    }
  }

  const handleRouterPartDetail = () => {
    if (
      course?.cta_status === 'PREVIEW' ||
      course?.course_section_link_parents?.[0]?.is_showing_locked
    ) {
      onClickPart(course?.id)
    }

    course?.course_section_type === 'PART' &&
    !course?.course_section_link_parents?.[0]?.is_preview_locked
      ? onClickPart(course?.id)
      : course?.course_section_link_parents?.[0]?.is_preview_locked &&
          course?.cta_status === 'BEGIN'
        ? toast.error('Sorry, you do not have access to this content')
        : {}
  }

  return (
    <div data-aos={ANIMATION.DATA_AOS} className="inner flex h-full flex-col">
      <div
        className={`name-course text-2xl font-medium text-bw-1 xl:h-[60px]`}
        onClick={handleRouterPartDetail}
      >
        {course?.course_section_link_parents?.[0]?.is_preview_locked ||
        course?.course_section_link_parents?.[0]?.is_showing_locked ? (
          <div className="flex justify-between">
            <div className="line-clamp-2 cursor-pointer text-ellipsis xl:h-[60px]">
              <SappTooltip
                title={course?.name}
                showTooltip={(course?.name as string)?.length > 40}
              >
                {truncateBySpace(course?.name, 40) ?? ''}
              </SappTooltip>
            </div>
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M18 13H8C6.89543 13 6 13.8954 6 15V21C6 22.1046 6.89543 23 8 23H18C19.1046 23 20 22.1046 20 21V15C20 13.8954 19.1046 13 18 13Z"
                  stroke="#B90E0A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13 19C13.5523 19 14 18.5523 14 18C14 17.4477 13.5523 17 13 17C12.4477 17 12 17.4477 12 18C12 18.5523 12.4477 19 13 19Z"
                  stroke="#B90E0A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9 13V9C9 7.93913 9.42143 6.92172 10.1716 6.17157C10.9217 5.42143 11.9391 5 13 5C14.0609 5 15.0783 5.42143 15.8284 6.17157C16.5786 6.92172 17 7.93913 17 9V13"
                  stroke="#B90E0A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        ) : (
          <div className="line-clamp-2 cursor-pointer text-ellipsis xl:h-[60px]">
            <SappTooltip
              title={course?.name}
              showTooltip={(course?.name as string)?.length > 40}
            >
              {truncateBySpace(course?.name, 40) ?? ''}
            </SappTooltip>
          </div>
        )}
      </div>
      <div className="des mb-15 mt-6">
        <div className="h-[120px]">
          <SappTooltip
            title={
              <p
                dangerouslySetInnerHTML={{
                  __html: course?.description,
                }}
              />
            }
            showTooltip={(course?.description as string)?.length > 200}
          >
            <p
              dangerouslySetInnerHTML={{
                __html: truncateHTML(25, course?.description) ?? '',
              }}
              className="h-[120px] text-base text-bw-1"
            />
          </SappTooltip>
        </div>
      </div>
      <div className="mt-auto">
        <div className="progress mb-7">
          <div className="info mb-2 flex justify-between">
            <div className="text flex items-end">
              <Icon type={`${iconType}`} />
              <p className="ml-px pl-1 text-medium-sm font-medium leading-[14px] text-bw-1">
                {showStatus}
              </p>
              <span className="ml-px pl-1 text-medium-sm font-medium text-gray-1">
                {formattedTime > 0 ? `${formattedTime} left` : ''}
              </span>
            </div>
            <div className="number">
              <p className="text-medium-sm font-medium text-bw-1">
                {progressPart}%
              </p>
            </div>
          </div>
          <div className="progressbar h-1.5 bg-gray-3">
            <div
              className="progress-percentage h-1.5 bg-primary"
              style={{ width: `${progressPart}%` }}
            ></div>
          </div>
        </div>
        <div className="action jusity-end relative flex items-center">
          <ButtonSecondary
            title={
              course?.cta_status === 'PREVIEW'
                ? 'Preview'
                : percentProgress === 0
                  ? 'Begin'
                  : percentProgress === 100
                    ? 'Review'
                    : 'Resume'
            }
            full={false}
            size={'small'}
            className="ml-auto"
            onClick={() => {
              handleRouterPartDetail()
              trackGAEventBasedOnProgress(percentProgress)
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
