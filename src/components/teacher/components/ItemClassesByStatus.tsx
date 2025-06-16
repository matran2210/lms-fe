import ButtonIconSapp from '@components/base/button/ButtonIconSapp'
import Icon from '@components/icons'
import { convertHourToDayLeft, convertLocalTimeToUTC } from '@utils/helpers'
import { truncateString } from '@utils/index'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import {
  ANIMATION,
  BUTTON_STATUS,
  CLASS_STATUS,
  CLASS_USER_TYPES,
  COURSE_STATUS,
  PageLink,
} from 'src/constants'
import { BookInClassIcon, ClockInClassIcon } from 'src/assets/icons/index'
import { IMyClass } from 'src/type/classes'
import { CLASS_TEACHER_STATUS } from '@utils/constants'

const statusMap = {
  [CLASS_TEACHER_STATUS.NOT_STARTED]: 'Not Started',
  [CLASS_TEACHER_STATUS.COMPLETED]: 'Completed',
  [CLASS_TEACHER_STATUS.IN_PROGRESS]: 'In progress',
  // [CLASS_TEACHER_STATUS.CANCELED]: '',
} as any
const ItemClassesByStatus = ({
  classes,
  index,
  lastElementRef,
  refetch,
}: {
  classes: IMyClass
  index: number
  lastElementRef?: (node: HTMLDivElement) => void
  refetch?: () => void
}) => {
  const router = useRouter()
  const student = classes?.classes?.[0]?.class_user_instances?.[0]
  const classInstance = classes?.classes?.[0]
  const [daysDifference, setDaysDifference] = useState(0)

  useEffect(() => {
    if (student?.finished_at) {
      const currentLocalDate = new Date()
      const currentUTCDate = convertLocalTimeToUTC(currentLocalDate)
      const finishDate = new Date(student?.finished_at)
      const finishUTCDate = convertLocalTimeToUTC(finishDate)
      const currentTime = currentUTCDate.getTime()
      const finishTime = finishUTCDate.getTime()
      const theRestHours = (finishTime - currentTime) / 3600000
      const dayLefts = convertHourToDayLeft(theRestHours)
      // Update state with the difference
      setDaysDifference(dayLefts)
    }
  }, [classes, student?.finished_at])

  const disabledCourseByClassType = [
    CLASS_USER_TYPES.RESERVED,
    CLASS_USER_TYPES.RETOOK,
    CLASS_USER_TYPES.TRANSFERED_TO,
    CLASS_USER_TYPES.MOVED_OUT,
    CLASS_USER_TYPES.CANCELED,
  ]

  // Function để hiển thị status của classes
  const checkStatusCourse = () => {
    const courseStatus = classes?.status
    const classStatus = classInstance?.status
    const classUserType = classInstance?.class_user_instances[0].type
    const studentStatus = student?.status
    const startedAt = student?.started_at
    const finishedAt = student?.finished_at

    // Chuyển đổi sang chuỗi theo định dạng ISO
    const formattedDate = new Date()

    if (
      courseStatus === COURSE_STATUS.PUBLISH ||
      courseStatus === COURSE_STATUS.LOCK
    ) {
      if (
        classUserType === CLASS_USER_TYPES.TRANSFERED_TO &&
        classInstance?.type === 'LESSON'
      ) {
        return BUTTON_STATUS.Disabled
      }
      if (
        classStatus === CLASS_STATUS.PUBLIC ||
        classStatus === CLASS_STATUS.ENDED
      ) {
        if (classes?.course_type === 'TRIAL_COURSE' && !student) {
          if (classInstance?.duration_type === 'FLEXIBLE')
            return BUTTON_STATUS.Active
          if (
            classInstance?.duration_type === 'FIXED' &&
            classInstance?.finished_at
          ) {
            const classFinish = new Date(classInstance?.finished_at as any)
            if (classFinish <= formattedDate) return BUTTON_STATUS.Extend
            if (classFinish > formattedDate) return BUTTON_STATUS.Active
          }
        }
        if (!startedAt && !finishedAt) {
          if (classInstance?.duration_type === 'FLEXIBLE')
            return BUTTON_STATUS.Active
          else return BUTTON_STATUS.Disabled // Thông báo lỗi học viên không có trong lớp
        }
        if (startedAt && finishedAt) {
          const finishedAtDate = new Date(student?.finished_at as any)
          if (
            classes?.course_type === 'TRIAL_COURSE' &&
            finishedAtDate <= formattedDate
          )
            return BUTTON_STATUS.Extend
          if (finishedAtDate <= formattedDate) return BUTTON_STATUS.Disabled
          if (finishedAtDate > formattedDate) {
            if (studentStatus === 'NOT_STARTED') return BUTTON_STATUS.Begin
            if (studentStatus === 'IN_PROGRESS') return BUTTON_STATUS.Resume
            if (studentStatus === 'COMPLETED') return BUTTON_STATUS.Review
          } else return BUTTON_STATUS.Disabled
        }
        return BUTTON_STATUS.Disabled
      }
      if (
        classStatus === CLASS_STATUS.DRAFT ||
        classStatus === CLASS_STATUS.BLOCK
      )
        return BUTTON_STATUS.Hidden
      return BUTTON_STATUS.Hidden
    }

    if (
      courseStatus === COURSE_STATUS.DRAFT ||
      courseStatus === COURSE_STATUS.BLOCK ||
      disabledCourseByClassType.includes(classUserType)
    )
      return BUTTON_STATUS.Hidden

    return BUTTON_STATUS.Hidden
  }

  const determineButtonToShow = checkStatusCourse() as any
  const classUserStatus = classes?.status
  const isProgress = classUserStatus === CLASS_TEACHER_STATUS.IN_PROGRESS
  const showStatus = statusMap[classUserStatus]
  const enableCourse =
    determineButtonToShow !== 'Disabled' && determineButtonToShow !== 'Extend'

  // Set active classes dựa theo trạng thái của học viên
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case `${CLASS_TEACHER_STATUS.NOT_STARTED}`:
        return 'like'
      case `${CLASS_TEACHER_STATUS.IN_PROGRESS}`:
        return 'hour'
      case `${CLASS_TEACHER_STATUS.COMPLETED}`:
        return 'completed'
      default:
        return ''
    }
  }
  const iconType = renderStatusIcon(classUserStatus ?? '')

  return (
    <div
      key={index}
      className={`item flex h-[345px] flex-col bg-white p-6 shadow-sidebar`}
      data-aos={ANIMATION.DATA_AOS}
      ref={lastElementRef}
    >
      <div className={`flex flex-col gap-6`}>
        <div className="flex items-center justify-between">
          {enableCourse ? (
            <span className="flex items-center gap-2 text-sm text-gray-400">
              <BookInClassIcon />
              {truncateString(classes?.code, 15)}
            </span>
          ) : (
            <div className="name-class text-medium-sm text-gray-400">
              <span className="ml-1 font-medium text-bw-1" />
            </div>
          )}
          <div className="time-class text-sm text-gray-400">
            {determineButtonToShow !== 'Active' && (
              <span className="flex items-center">
                <ClockInClassIcon />
                <span
                  className={`font-medium ${
                    enableCourse ? 'text-bw-1' : 'text-gray-400'
                  } ml-2`}
                >
                  {daysDifference > 0
                    ? daysDifference
                    : enableCourse
                      ? 1
                      : 0}{' '}
                </span>
                &nbsp;{daysDifference > 1 ? 'days left' : 'day left'}
              </span>
            )}
          </div>
        </div>

        <div className={`text-lg font-semibold text-gray-700 xl:h-[47px]`}>
          <div className="line-clamp-2 cursor-pointer text-ellipsis">
            {truncateString(classes?.course?.name, 50)}
          </div>
        </div>
        <div className="mt-[-12px] text-sm font-normal text-gray-800 xl:h-[72px]">
          {classes?.description}
        </div>

        <div className="progress h-8">
          <div className="info mb-2 flex items-center justify-between">
            <div className="text flex items-center">
              <Icon
                type={enableCourse ? iconType : 'expired'}
                className={`relative ${
                  enableCourse ? 'text-bw-1' : 'text-gray-2'
                }`}
              />
              <p
                className={`text-medium-sm font-medium ${
                  enableCourse ? 'text-bw-1' : 'text-gray-2 '
                } ml-px pl-2`}
              >
                {enableCourse ? showStatus : 'Expired'}
              </p>
            </div>
            <div className="number">
              <p
                className={`text-medium-sm font-medium ${
                  enableCourse ? 'text-bw-1' : 'text-gray-2 '
                }`}
              >
                {classes?.progress?.toFixed(2)}%
              </p>
            </div>
          </div>
          <div className="progressbar h-1.5 bg-gray-3">
            <div
              className={`progress-percentage ${
                enableCourse ? 'bg-primary' : 'bg-gray-2'
              } h-1.5`}
              style={{ width: `${classes?.progress}%` }}
            />
          </div>
        </div>

        <div className="action relative flex items-center justify-end">
          {determineButtonToShow !== 'Disabled' ? (
            <ButtonIconSapp
              title="Xem chi tiết"
              icon="arrow"
              variant="secondary"
              full
              position="end"
              iconColorProps={isProgress ? '#ffb800' : '#374151'}
              className={
                isProgress
                  ? 'text- border border-primary text-orange-3'
                  : 'border border-gray-800'
              }
              link={`${PageLink.TEACHER_MY_CLASS}/${classes?.id}`}
            />
          ) : (
            <div className="action relative flex h-8 items-center justify-end" />
          )}
        </div>
      </div>
    </div>
  )
}

export default ItemClassesByStatus
