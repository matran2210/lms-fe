import { ButtonSecondary } from '@lms/ui'
import CardCourse from '@components/common/CardCourse/CardCourse'
import { Icon } from '@lms/assets/icons'
import { useCourseContext } from '@contexts/index'
import { trackGAEvent } from '@lms/utils'
import { getUserPrefix } from '@utils/helpers'
import { buildQueryString, formatTime, handleReplaceText } from '@lms/utils'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import Tooltip from 'src/common/Tooltip'
import { useTailwindBreakpoint } from '@lms/hooks'
import { CLASS_USER_STATUS, IMyCourseDetail } from '@lms/core'

const Part = ({
  course,
  focusSubSectionIds,
  focusUnitIds,
  deadline,
  isLock,
  lastElementRef,
  isTeacher = false,
}: {
  course: IMyCourseDetail
  focusSubSectionIds?: string
  focusUnitIds?: string
  deadline?: string
  isLock?: boolean
  lastElementRef: (node: HTMLDivElement) => void
  isTeacher?: boolean
}) => {
  const router = useRouter()
  const { isMobileView } = useTailwindBreakpoint()
  const total = course?.learning_progress?.total_course_sections ?? 0
  const completed =
    course?.learning_progress?.total_course_sections_completed ?? 0

  const percentProgress = total > 0 ? round((completed / total) * 100, 2) : 0

  const onClickPart = (id: string) => {
    const searchParams = buildQueryString({
      focusSubSectionIds,
      focusUnitIds,
      deadline,
    })
    router.push(
      `${getUserPrefix(isTeacher)}/courses/${router.query.courseId}/section/${id}?${searchParams}`,
    )
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

  const { setOpenPopupCTA } = useCourseContext()

  const handleRouterPartDetail = () => {
    if (course?.course_section_link_parents?.[0]?.is_showing_locked) {
      onClickPart(course?.id)
    }

    if (
      course?.course_section_type === 'PART' &&
      !course?.course_section_link_parents?.[0]?.is_preview_locked
    ) {
      onClickPart(course?.id)
    } else if (course?.course_section_link_parents?.[0]?.is_preview_locked) {
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    }
  }

  const transformAllFontSize = (html: string = '') => {
    if (!html) return ''
    return html.replace(
      /font-size\s*:\s*[^;"]+/gi,
      isMobileView ? 'font-size: 14px' : 'font-size: 16px',
    )
  }

  const description = handleReplaceText(course?.description)

  return (
    <CardCourse
      hideBadge
      title={course?.name}
      key={course?.id}
      ref={lastElementRef}
      classNameTitle={`h-12 md:h-16 font-medium`}
      classNameCard="lg:h-[456px] md:h-[428px] h-[328px]"
      isLock={isLock}
      onClick={() => {
        handleRouterPartDetail()
        trackGAEventBasedOnProgress(percentProgress)
      }}
    >
      <div className="flex h-full flex-1 flex-col">
        <div className="des my-4 h-[62px] text-ellipsis leading-snug md:my-6 md:h-[140px]">
          <Tooltip
            title={
              <div
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            }
            showTooltip={(description as string)?.length > 150}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: description ?? '',
              }}
              className="line-clamp-6 text-sm font-normal text-gray-800 md:text-base"
            />
          </Tooltip>
        </div>

        <div className="mt-auto">
          <div className="progress mb-6">
            <div className="info mb-2 flex justify-between">
              <div className="text flex items-center">
                <Icon type={`${iconType}`} />
                <p className="ml-px pl-1 text-sm font-normal text-gray-800">
                  {showStatus}
                </p>
                <span className="ml-px pl-1 text-sm font-medium text-gray-400">
                  {formattedTime > 0 ? `${formattedTime} left` : ''}
                </span>
              </div>
              <div className="number">
                <p className="text-sm font-normal text-gray-800">
                  {progressPart}%
                </p>
              </div>
            </div>
            <div className="progressbar h-[6px] rounded-[100px] bg-[#F1F1F1]">
              <div
                className="progress-percentage h-[6px] rounded-[100px] bg-primary"
                style={{ width: `${progressPart}%` }}
              ></div>
            </div>
          </div>
          <div className="action flex items-center justify-end">
            <ButtonSecondary
              size="small"
              full
              title={
                course?.cta_status === 'PREVIEW'
                  ? 'Preview'
                  : percentProgress === 0
                    ? 'Begin'
                    : percentProgress === 100
                      ? 'Review'
                      : 'Resume'
              }
              className="w-full md:w-[84px]"
              onClick={() => {
                handleRouterPartDetail()
                trackGAEventBasedOnProgress(percentProgress)
              }}
            />
          </div>
        </div>
      </div>
    </CardCourse>
  )
}

export default Part
