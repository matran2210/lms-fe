import { ArrowLeft, ArrowRight } from '@assets/icons'
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
  sessionData: any[]
}
const ActivityPagination = ({
  activity,
  focusOnlyQuiz,
  sessionData,
}: IProps) => {
  const router = useRouter()
  const endActivityRef = useRef<HTMLDivElement>(null)

  const { setOpenPopupCTA } = useCourseContext()

  // Tạo một mảng chứa các id của các hoạt động từ sessionData
  const activityIds = sessionData?.map(
    (activity: IActivity) => activity.id as string,
  )

  // Lấy id của hoạt động tiếp theo
  const nextActivityId = activity?.next_activity?.id

  // Tìm vị trí của hoạt động tiếp theo trong mảng activityIds
  const nextActivityIndex = activityIds?.indexOf(
    nextActivityId || (router.query.activityId as string),
  )

  // Lấy id của hoạt động trước đó
  const previousActivityId = activity?.previous_activity?.id
  // Tìm vị trí của hoạt động trước đó trong mảng activityIds
  const previousActivityIndex = activityIds?.indexOf(
    previousActivityId || (router.query.activityId as string),
  )

  // Lấy danh sách trạng thái khóa của các hoạt động trong phiên làm việc
  const activityPreviewLocks = sessionData?.map(
    (activity: IActivity) => activity?.is_preview_locked,
  )

  // Kiểm tra xem hoạt động tiếp theo có bị khóa hay không
  const isNextActivityLocked =
    activityPreviewLocks?.[nextActivityIndex + 1] || false

  // Kiểm tra xem hoạt động trước đó có bị khóa hay không
  const isPreviousActivityLocked =
    activityPreviewLocks?.[previousActivityIndex - 1] || false

  const idPreviousActivity =
    activity?.previous_activity?.id || activityIds?.[previousActivityIndex - 1]

  const idNextActivity: string = activity?.next_activity
    ? activity?.next_activity?.id
    : (activityIds?.[nextActivityIndex + 1] ?? '')

  const findActivityByIndex = (previousIndex: number) => {
    return sessionData?.find(
      (activity: IActivity) => activity?.id === activityIds?.[previousIndex],
    )
  }
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
      return <SappIcon icon="locksection"></SappIcon>
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
      {(activity?.previous_activity ||
        activity?.next_activity ||
        (nextActivityIndex !== -1 &&
          nextActivityIndex !== sessionData?.length - 1) ||
        (previousActivityIndex !== -1 && previousActivityIndex !== 0)) && (
        <div
          data-aos={ANIMATION.DATA_AOS}
          className={clsx(
            'learning-activity-collapse shadow-learning-activity rounded-xl bg-white p-6',
            { hidden: focusOnlyQuiz },
          )}
        >
          <div
            ref={endActivityRef}
            className={`flex flex-nowrap gap-5 justify-${
              activity?.previous_activity ||
              (previousActivityIndex !== -1 && previousActivityIndex !== 0)
                ? 'between'
                : 'end'
            }`}
          >
            {(activity?.previous_activity ||
              (previousActivityIndex !== -1 &&
                previousActivityIndex !== 0)) && (
              <div className="w-1/2">
                <div
                  onClick={() =>
                    handleActivityNavigation(
                      isPreviousActivityLocked,
                      idPreviousActivity,
                      'Click Button Previous Activity',
                    )
                  }
                  className="text-bw-1 mb-3 flex cursor-pointer select-none items-center gap-2 whitespace-nowrap text-sm font-semibold underline hover:text-primary"
                >
                  <ArrowLeft /> Previous Activity
                </div>
                <div className="text-medium-sm text-gray-1 flex">
                  {getCourseIcon(
                    activity?.previous_activity
                      ? activity?.previous_activity?.display_icon
                      : findActivityByIndex(previousActivityIndex - 1)
                          ?.display_icon,
                    isPreviousActivityLocked,
                  )}
                  <Tooltip
                    title={
                      activity?.previous_activity
                        ? activity?.previous_activity?.name
                        : findActivityByIndex(previousActivityIndex - 1)?.name
                    }
                    showTooltip={
                      !!(
                        activity?.previous_activity?.name &&
                        activity?.previous_activity?.name?.length > 80
                      )
                    }
                  >
                    <span className="leading-4.5 ml-2 w-full overflow-hidden text-ellipsis">
                      {activity?.previous_activity
                        ? truncateString(activity?.previous_activity?.name, 80)
                        : truncateString(
                            findActivityByIndex(previousActivityIndex - 1)
                              ?.name,
                            80,
                          )}
                    </span>
                  </Tooltip>
                </div>
              </div>
            )}
            {!activity?.previous_activity && <></>}
            {(activity?.next_activity ||
              (nextActivityIndex !== -1 &&
                nextActivityIndex !== sessionData?.length - 1)) && (
              <div className="w-1/2">
                <div
                  onClick={() =>
                    handleActivityNavigation(
                      isNextActivityLocked,
                      idNextActivity,
                      'Click Button Next Activity',
                    )
                  }
                  className="text-bw-1 mb-3 flex cursor-pointer select-none items-center justify-end gap-2 text-sm font-semibold underline hover:text-primary"
                >
                  Next Activity <ArrowRight />
                </div>
                <div className="text-gray-500 flex justify-end text-sm">
                  {getCourseIcon(
                    activity?.next_activity
                      ? activity?.next_activity?.display_icon
                      : findActivityByIndex(nextActivityIndex + 1)
                          ?.display_icon,
                    isNextActivityLocked,
                  )}
                  <Tooltip
                    title={
                      activity?.next_activity
                        ? activity?.next_activity?.name
                        : findActivityByIndex(nextActivityIndex + 1)?.name
                    }
                    showTooltip={
                      !!(
                        activity?.next_activity?.name &&
                        activity?.next_activity?.name?.length > 80
                      )
                    }
                  >
                    <div className="leading-4.5 mr-2 line-clamp-1 w-full overflow-hidden text-ellipsis text-end">
                      {activity?.next_activity
                        ? truncateString(activity?.next_activity.name, 80)
                        : truncateString(
                            findActivityByIndex(nextActivityIndex + 1)?.name,
                            80,
                          )}
                    </div>
                  </Tooltip>
                </div>
              </div>
            )}
            {!activity?.next_activity && <></>}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActivityPagination
