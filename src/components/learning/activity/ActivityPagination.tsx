import {
  ArrowLeft,
  ArrowRight,
  CollapseArrowIcon,
  LockClosedIcon,
} from '@assets/icons'
import CtaTrial from '@components/layout/PinnedNotifications/CtaTrial'
import { useCourseContext } from '@contexts/index'
import { trackGAEvent } from '@utils/google-analytics'
import { truncateString } from '@utils/index'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import React, { useRef } from 'react'
import SappIcon from 'src/common/SappIcon'
import Tooltip from 'src/common/Tooltip'
import { ANIMATION } from 'src/constants'
import { IActivity } from 'src/type/course/my-course/Activity'
interface IProps {
  activity: IActivity
  focusOnlyQuiz: boolean
  isArrowTitle?: boolean
}
const ActivityPagination = ({
  activity,
  focusOnlyQuiz,
  isArrowTitle = false,
}: IProps) => {
  const router = useRouter()
  const endActivityRef = useRef<HTMLDivElement>(null)

  const { setOpenPopupCTA, openPopupCTA } = useCourseContext()
  /**
   * Hàm xử lý điều hướng hoạt động.
   * @param isLocked - Trạng thái khóa của hoạt động (true nếu bị khóa).
   * @param activityId - ID của hoạt động cần điều hướng.
   * @param eventLabel - Nhãn sự kiện để theo dõi Google Analytics.
   */
  const handleActivityNavigation = (
    isLocked: boolean,
    activityId: string,
    eventLabel: string,
  ) => {
    if (isLocked) {
      // Nếu hoạt động bị khóa, hiển thị popup thông báo
      setOpenPopupCTA({
        lockSection: true,
        ctaUpgrade: false,
        thankYou: false,
        thankYouLater: false,
      })
    } else {
      // Nếu hoạt động không bị khóa, điều hướng đến hoạt động và ghi nhận sự kiện
      router.push({
        pathname: `/courses/${router.query.id}/activity/${activityId}`,
      })
      trackGAEvent(eventLabel) // Ghi nhận sự kiện Google Analytics
    }
  }
  /**
   * Hàm trả về biểu tượng (icon) tương ứng với loại hoạt động của khóa học.
   * @param type - Loại hoạt động (TEXT, VIDEO, PAST_EXAM_ANALYSIS, QUIZ).
   * @param lockActivity - Trạng thái khóa hoạt động (true nếu bị khóa).
   * @returns JSX.Element hoặc null nếu không tìm thấy loại hoạt động.
   */
  const getCourseIcon = (type: string, lockActivity: boolean) => {
    // Nếu cấu phần bị khóa, trả về biểu tượng khóa
    if (lockActivity) {
      return <LockClosedIcon className="shrink-0" />
    }

    // Bản đồ các loại hoạt động với biểu tượng tương ứng
    const iconMap: Record<string, any> = {
      TEXT: 'course_text', // Biểu tượng cho hoạt động dạng văn bản
      VIDEO: 'course_video', // Biểu tượng cho hoạt động dạng video
      PAST_EXAM_ANALYSIS: 'course_past_exam_analysis', // Biểu tượng cho phân tích bài thi cũ
      QUIZ: 'course_quiz', // Biểu tượng cho bài kiểm tra
    }

    // Trả về biểu tượng tương ứng nếu tìm thấy, nếu không trả về null
    return iconMap[type] ? <SappIcon icon={iconMap[type]} /> : null
  }
  return (
    <div>
      {(activity?.previous_activity?.id || activity?.next_activity?.id) && (
        <div
          data-aos={ANIMATION.DATA_AOS}
          className={clsx(
            'learning-activity-collapse rounded-xl',
            { hidden: focusOnlyQuiz },
            {
              'bg-transparent p-0 shadow-none': isArrowTitle,
              'bg-white p-6 shadow-learning-activity': !isArrowTitle,
            },
          )}
        >
          <div
            ref={endActivityRef}
            className={`flex flex-nowrap gap-5 justify-${activity?.previous_activity?.id ? 'between' : 'end'}`}
          >
            {activity?.previous_activity?.id && (
              <div className={clsx('w-1/2', { 'w-full': isArrowTitle })}>
                <div
                  onClick={() =>
                    handleActivityNavigation(
                      activity?.previous_activity?.is_preview_locked || false,
                      activity?.previous_activity?.id || '',
                      'Click Button Previous Activity',
                    )
                  }
                  className={clsx(
                    'flex cursor-pointer select-none items-center gap-2 whitespace-nowrap text-sm font-semibold underline hover:text-primary',
                    {
                      'text-bw-13': isArrowTitle,
                      'text-bw-1 mb-3': !isArrowTitle,
                    },
                  )}
                >
                  {isArrowTitle ? (
                    <CollapseArrowIcon className="rotate-90" />
                  ) : (
                    <>
                      <ArrowLeft /> Previous Activity
                    </>
                  )}
                </div>
                <div
                  className={clsx(
                    'flex items-center gap-2 text-sm text-[#6b7280]',
                    { hidden: isArrowTitle },
                  )}
                >
                  {getCourseIcon(
                    activity?.previous_activity?.display_icon,
                    false,
                  )}
                  <Tooltip
                    title={activity?.previous_activity?.name}
                    showTooltip={
                      !!(
                        activity?.previous_activity?.name &&
                        activity?.previous_activity?.name?.length > 80
                      )
                    }
                  >
                    <span className="w-full overflow-hidden text-ellipsis leading-4.5">
                      {truncateString(activity?.previous_activity?.name, 80)}
                    </span>
                  </Tooltip>
                  {getCourseIcon(
                    activity?.previous_activity?.display_icon,
                    activity?.previous_activity?.is_preview_locked || false,
                  )}
                </div>
              </div>
            )}
            {!activity?.previous_activity?.id && <></>}
            {!isArrowTitle && activity?.next_activity?.id && (
              <div className="w-1/2">
                <div
                  onClick={() =>
                    handleActivityNavigation(
                      activity?.next_activity?.is_preview_locked,
                      activity?.next_activity?.id,
                      'Click Button Next Activity',
                    )
                  }
                  className="text-bw-1 mb-3 flex cursor-pointer select-none items-center justify-end gap-2 text-sm font-semibold underline hover:text-primary"
                >
                  Next Activity <ArrowRight />
                </div>
                <div className="flex items-center justify-end gap-2 text-sm text-[#6b7280]">
                  {getCourseIcon(activity?.next_activity?.display_icon, false)}
                  <Tooltip
                    title={activity?.next_activity?.name}
                    showTooltip={
                      !!(
                        activity?.next_activity?.name &&
                        activity?.next_activity?.name?.length > 80
                      )
                    }
                  >
                    <div className="line-clamp-1 w-full overflow-hidden text-ellipsis text-end leading-4.5">
                      {truncateString(activity?.next_activity.name, 80)}
                    </div>
                  </Tooltip>
                  {getCourseIcon(
                    activity?.next_activity?.display_icon,
                    activity?.next_activity?.is_preview_locked || false,
                  )}
                </div>
              </div>
            )}
            {!activity?.next_activity?.id && <></>}
          </div>
        </div>
      )}
      <CtaTrial />
    </div>
  )
}

export default ActivityPagination
