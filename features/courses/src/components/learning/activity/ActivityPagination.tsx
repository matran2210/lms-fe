import {
  ArrowLeft,
  ArrowRight,
  CollapseArrowIcon,
  LockClosedIcon,
} from '@lms/assets'
import { ButtonText } from '@lms/ui'
import { useCourseContext, useFeature } from '@lms/contexts'
import { trackGAEvent, truncateString } from '@lms/utils'
import clsx from 'clsx'
import React, { useRef, useState } from 'react'
import { SappIcon } from '@lms/ui'
import { Tooltip } from "@lms/ui";
import { ANIMATION, INeighborActivity } from '@lms/core'
import { IActivity } from '@lms/core'
import { NextStorylineModal } from '../storyline'
interface IProps {
  activity: IActivity
  focusOnly: boolean
}
const ActivityPagination = ({ activity, focusOnly }: IProps) => {
  const { router, params, query } = useFeature()
  const endActivityRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<{
    open: boolean
    neighborActivity: INeighborActivity | null
  }>({
    open: false,
    neighborActivity: null,
  })
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
    isStorylineSection: boolean,
    neighborActivity: INeighborActivity | null
  ) => {
    if (isStorylineSection) {
      setOpen(
        {
          open: true,
          neighborActivity,
        },
      )
      return
    }
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
      router.push(`/courses/${params?.id || query.id}/activity/${activityId}?course_section_id=${query?.course_section_id}`)
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
    return iconMap[type] ? (
      <SappIcon icon={iconMap[type]} colorIcon="#6b7280" />
    ) : null
  }
  return (
    <div>
      {(activity?.previous_activity?.id || activity?.next_activity?.id) && (
        <div
          data-aos={ANIMATION.DATA_AOS}
          className={clsx(
            'learning-activity-collapse rounded-xl md:bg-white md:p-6 md:shadow-small',
            { hidden: focusOnly },
          )}
        >
          <div
            ref={endActivityRef}
            className={`flex flex-nowrap gap-5 justify-${activity?.previous_activity?.id ? 'between' : 'end'}`}
          >
            {activity?.previous_activity?.id && (
              <div className="flex w-1/2 flex-col items-start">
                <ButtonText
                  title={activity?.previous_activity?.course_section_type === "STORY_LINE" ? "Previous Storyline" : "Previous Activity"}
                  className="mb-3"
                  startIcon={<ArrowLeft />}
                  onClick={() =>
                    handleActivityNavigation(
                      activity?.previous_activity?.is_preview_locked || false,
                      activity?.previous_activity?.id || '',
                      'Click Button Previous Activity',
                      activity?.previous_activity?.course_section_type === "STORY_LINE",
                      activity?.previous_activity || null
                    )
                  }
                />
                <div
                  className={clsx(
                    'hidden items-center gap-2 text-sm text-[#6b7280] md:flex',
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
                  {activity?.previous_activity?.is_preview_locked &&
                    getCourseIcon(
                      activity?.previous_activity?.display_icon,
                      activity?.previous_activity?.is_preview_locked || false,
                    )}
                </div>
              </div>
            )}
            {!activity?.previous_activity?.id && <></>}
            {activity?.next_activity?.id && (
              <div className="flex w-1/2 flex-col items-end">
                <ButtonText
                  title={activity?.next_activity?.course_section_type === "STORY_LINE" ? "Next Storyline" : "Next Activity"}
                  className="mb-3"
                  endIcon={<ArrowRight />}
                  onClick={() =>
                    handleActivityNavigation(
                      activity?.next_activity?.is_preview_locked,
                      activity?.next_activity?.id,
                      'Click Button Next Activity',
                      activity?.next_activity?.course_section_type === "STORY_LINE",
                      activity?.next_activity || null
                    )
                  }
                />
                <div className="hidden items-center justify-end gap-2 text-sm text-[#6b7280] md:flex">
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
                  {activity?.next_activity?.is_preview_locked &&
                    getCourseIcon(
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
      {
        open.open && open.neighborActivity && <NextStorylineModal
          open={open.open}
          setOpen={(status: boolean) => setOpen({ open: status, neighborActivity: open.neighborActivity })}
          next_activity={open.neighborActivity}
          course_section_id={query?.course_section_id} />
      }
    </div>
  )
}

export default ActivityPagination
