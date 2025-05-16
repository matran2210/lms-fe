import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { useCourseContext } from '@contexts/index'
import { trackGAEvent } from '@utils/google-analytics'
import { convertHourToDayLeft, convertLocalTimeToUTC } from '@utils/helpers'
import { clearStylesHtml, truncateString } from '@utils/index'
import { differenceInDays, parseISO, startOfDay } from 'date-fns'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import Tooltip from 'src/common/Tooltip'
import {
  ANIMATION,
  BUTTON_STATUS,
  CLASS_STATUS,
  CLASS_USER_TYPES,
  COURSE_STATUS,
} from 'src/constants'
import { CoursesAPI } from 'src/pages/api/courses'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'
import PopupActive from './PopupActive'
import PopupExtend from './PopupExtend'
import PopupLesson from './PopupLesson'
import PopupOpenClass from './PopupOpenClass'
import ModalFoundationCompleted from './ModalFoundationCompleted'

const Course = ({
  course,
  index,
  lastElementRef,
  refetch,
}: {
  course: ICourse
  index: number
  lastElementRef: (node: HTMLDivElement) => void
  refetch: () => void
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [openExtend, setOpenExtend] = useState<boolean>(false)
  const [openActive, setOpenActive] = useState<boolean>(false)
  const [timeActive, setTimeActive] = useState<number>()
  const [openLesson, setOpenLesson] = useState<boolean>(false)
  const [openClass, setOpenClass] = useState<boolean>(false)
  const router = useRouter()
  const student = course?.classes?.[0]?.class_user_instances?.[0]
  const classInstance = course?.classes[0]
  const [daysDifference, setDaysDifference] = useState(0)
  const currentDate = useMemo(() => new Date(), [])

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
  }, [course, student?.finished_at])

  const percentProgress =
    round(
      (Number(
        student?.learning_progress?.total_course_sections_completed ?? 0,
      ) /
        Number(student?.learning_progress?.total_course_sections ?? 0)) *
        100,
      2,
    ) || 0

  const disabledCourseByClassType = [
    CLASS_USER_TYPES.RESERVED,
    CLASS_USER_TYPES.RETOOK,
    CLASS_USER_TYPES.TRANSFERED_TO,
    CLASS_USER_TYPES.MOVED_OUT,
    CLASS_USER_TYPES.CANCELED,
  ]

  // Function để hiển thị status của course
  const checkStatusCourse = () => {
    const courseStatus = course?.status
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
        if (course?.course_type === 'TRIAL_COURSE' && !student) {
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
            course?.course_type === 'TRIAL_COURSE' &&
            finishedAtDate <= formattedDate
          )
            return BUTTON_STATUS.Extend
          if (finishedAtDate <= formattedDate) return BUTTON_STATUS.Disabled
          if (finishedAtDate > formattedDate) {
            if (studentStatus === 'READY_TO_LEARN') return BUTTON_STATUS.Begin
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

  // Set active course dựa theo trạng thái của học viên
  const renderStatusUser = (status: string) => {
    switch (status) {
      case CLASS_USER_TYPES.RESERVED:
        return false
      case CLASS_USER_TYPES.TRANSFERED_TO:
        return false
      case CLASS_USER_TYPES.CANCELED:
        return false
      default:
        return true
    }
  }
  const isActiveStudent = renderStatusUser(student?.type ?? '')

  async function activeCourse() {
    try {
      const params = {
        classId: `${classInstance?.id}`,
      }
      await CoursesAPI.activeCourse(params)
      // await fetchCourseList()
      refetch()
      toast.success('Active thành công!')
    } catch (error) {}
  }
  async function extendCourse() {
    try {
      const res = await CoursesAPI.extendCourse({ classId: classInstance?.id })
      if (res?.success) {
        refetch()
        toast.success('Gia hạn hành công!')
      }
    } catch (error) {}
  }

  const { courseType } = useCourseContext()

  useEffect(() => {
    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('daysDifference', '')
    } else {
      localStorage.removeItem('daysDifference')
    }
  }, [courseType])

  const handleCourseDetail = () => {
    const isRedirectDashboard =
      course?.course_type == 'NORMAL_COURSE' ||
      course?.course_type == 'PRACTICE_COURSE'

    // Tạm ẩn redirect dashboard begin
    // if (
    //   isRedirectDashboard &&
    //   (determineButtonToShow == BUTTON_STATUS.Review ||
    //     determineButtonToShow == BUTTON_STATUS.Resume)
    // ) {
    //   router.push(`/courses/my-course/${classInstance?.id}/dashboard`)
    // } else {
    //   router.push(`/courses/my-course/${classInstance?.id}`)
    // }

    router.push(`/courses/my-course/${classInstance?.id}`)
    // Tạm ẩn redirect dashboard end

    if (isRedirectDashboard) {
      localStorage.setItem(
        'courseInfo',
        JSON.stringify({
          name: course.name,
          courseType: course.course_type,
          category: course.course_categories[0]?.name,
        }),
      )
    } else {
      localStorage.removeItem('courseInfo')
    }

    localStorage.setItem(
      'courseDetail',
      `/courses/my-course/${classInstance?.id}`,
    )
    if (course?.course_type === 'TRIAL_COURSE') {
      localStorage.setItem('daysDifference', daysDifference as any)
      localStorage.setItem('showPinTrial', 'true')
    } else {
      localStorage.removeItem('daysDifference')
      localStorage.removeItem('showPinTrial')
    }
  }

  /**
   * @description Trạng thái điều khiển việc hiển thị modal hoặc giao diện tiếp tục học lớp nền tảng.
   *
   * @type {boolean}
   * @default false - Mặc định đóng modal.
   */
  const [openContinue, setOpenContinue] = useState(false)

  const courseAction = () => {
    const isPendingLesson =
      classInstance?.type === 'LESSON' && !student?.is_passed

    if (isPendingLesson && course?.course_categories?.[0]?.name !== 'ACCA') {
      setOpenLesson(true)
    } else if (
      isPendingLesson &&
      course?.course_categories?.[0]?.name === 'ACCA'
    ) {
      setOpenContinue(true)
    } else if (determineButtonToShow === 'Active') {
      if (classInstance?.duration_type === 'FLEXIBLE') {
        setTimeActive(Number(classInstance?.flexible_days))
      } else {
        const classFinishedAt = parseISO(
          classInstance?.finished_at as any,
        ).setUTCHours(0, 0, 0, 0)
        const getDateActive = differenceInDays(
          startOfDay(classFinishedAt),
          startOfDay(currentDate),
        ) as any
        setTimeActive(Number(getDateActive + 1))
      }
      setOpenActive(true)
    } else if (determineButtonToShow === 'Extend') {
      setOpenExtend(true)
    } else if (!classInstance?.class_user_instances?.[0]?.is_opened) {
      setOpenClass(true)
    } else {
      course.status !== CLASS_USER_STATUS.CANCELED ? handleCourseDetail() : {}
    }
  }

  // Set enable course dựa theo trạng thái của course
  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as const

  const classUserStatus = student?.status as keyof typeof statusMap
  const showStatus = statusMap[classUserStatus]
  const enableCourse =
    determineButtonToShow !== 'Disabled' && determineButtonToShow !== 'Extend'

  // Set active course dựa theo trạng thái của học viên
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case `${CLASS_USER_STATUS.READY_TO_LEARN}`:
        return 'like'
      case `${CLASS_USER_STATUS.IN_PROGRESS}`:
        return 'hour'
      case `${CLASS_USER_STATUS.COMPLETED}`:
        return 'completed'
      default:
        return ''
    }
  }
  const iconType = renderStatusIcon(classUserStatus ?? '')

  const progressPart = percentProgress > 100 ? 100 : percentProgress

  /**
   * @description Xử lý điều hướng người dùng đến lớp học nền tảng (foundation class) đầu tiên của khóa học.
   * URL sẽ được tạo từ `foundation_class_id` nằm trong kết nối lớp học thường.
   *
   * @remarks
   * - Hàm sử dụng `router.push` để điều hướng.
   * - Nếu không có `course` hoặc dữ liệu lớp học chưa sẵn sàng, đường dẫn có thể không chính xác.
   */
  const handleContinueFoundation = () => {
    router.push(
      `/courses/my-course/${course?.classes?.[0]?.normal_class_connections?.[0]?.foundation_class_id}`,
    )
  }

  /**
   * @description Gửi yêu cầu bỏ qua (skip) lớp học nền tảng hiện tại cho khóa học.
   *
   * @remarks
   * - Gọi API `CoursesAPI.skipFoundation` với `classId` đầu tiên trong danh sách lớp học.
   * - Sau khi thao tác thành công, gọi lại `refetch()` để cập nhật lại dữ liệu giao diện.
   *
   * @returns {Promise<void>}
   */
  const handleSkipCourse = async () => {
    try {
      await CoursesAPI.skipFoundation(course?.classes?.[0]?.id)
    } finally {
      setOpenContinue(false)
      refetch()
    }
  }

  return (
    <>
      {determineButtonToShow !== 'Hidden' && (
        <div
          key={index}
          className={`item flex flex-col bg-white p-7.5 shadow-sidebar`}
          data-aos={ANIMATION.DATA_AOS}
          ref={lastElementRef}
        >
          <div className={`flex min-h-352 flex-col`}>
            <div
              className={`name-course mb-4 text-2xl font-medium xl:h-[60px] ${
                !enableCourse ? 'text-gray-2' : 'text-bw-1'
              }`}
            >
              <div
                className="line-clamp-2 cursor-pointer text-ellipsis"
                onClick={() => {
                  if (isActiveStudent && enableCourse) {
                    courseAction()
                  }
                  trackGAEvent('Click Title Course Item')
                }}
              >
                <Tooltip
                  title={course?.name}
                  showTooltip={(course?.name as string)?.length > 30}
                >
                  {truncateString(course?.name, 30)}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center justify-between">
              {enableCourse ? (
                <div className="name-class text-medium-sm text-gray-1">
                  Class:
                  <span className="ml-1 font-medium text-bw-1">
                    <Tooltip
                      title={course?.classes?.[0]?.code}
                      showTooltip={course?.classes?.[0]?.code?.length > 15}
                    >
                      {truncateString(course?.classes?.[0]?.code, 15)}
                    </Tooltip>
                  </span>
                </div>
              ) : (
                <div className="name-class text-medium-sm text-gray-1">
                  <span className="ml-1 font-medium text-bw-1" />
                </div>
              )}
              <div className="time-class text-medium-sm text-gray-2">
                {determineButtonToShow !== 'Active' && (
                  <span>
                    <span
                      className={`font-medium ${
                        enableCourse ? 'text-bw-1' : 'text-gray-1'
                      }`}
                    >
                      {daysDifference > 0
                        ? daysDifference
                        : enableCourse
                          ? 1
                          : 0}{' '}
                    </span>
                    {daysDifference > 1 ? 'days left' : 'day left'}
                  </span>
                )}
              </div>
            </div>
            <div className="des mb-8 mt-6 line-clamp-5 h-[116px] text-ellipsis">
              {(course?.description as string)?.length > 250 ? (
                <Tooltip
                  title={
                    <p
                      dangerouslySetInnerHTML={{
                        __html: clearStylesHtml(course?.description),
                      }}
                    />
                  }
                  placement="bottom"
                >
                  <p
                    dangerouslySetInnerHTML={{
                      __html: clearStylesHtml(course?.description),
                    }}
                    className={`text-bas h-24 ${
                      enableCourse ? 'text-bw-1' : 'text-gray-2 '
                    }`}
                  />
                </Tooltip>
              ) : (
                <p
                  dangerouslySetInnerHTML={{
                    __html: clearStylesHtml(course?.description),
                  }}
                  className={`text-bas h-24 ${
                    enableCourse ? 'text-bw-1' : 'text-gray-2 '
                  }`}
                />
              )}
            </div>
            <div className="mt-auto">
              <div className="progress mb-6 h-8">
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
                      {progressPart}%
                    </p>
                  </div>
                </div>
                <div className="progressbar h-1.5 bg-gray-3">
                  <div
                    className={`progress-percentage ${
                      enableCourse ? 'bg-primary ' : 'bg-gray-2'
                    } h-1.5`}
                    style={{ width: `${progressPart}%` }}
                  ></div>
                </div>
              </div>
              <div className="action relative flex items-center justify-end">
                {determineButtonToShow !== 'Disabled' ? (
                  <ButtonSecondary
                    title={
                      determineButtonToShow === 'Active'
                        ? 'Activate'
                        : determineButtonToShow
                    }
                    full={false}
                    size={'small'}
                    className="ml-auto"
                    onClick={() => {
                      if (isActiveStudent) {
                        courseAction()
                      }
                      trackGAEvent('CLick Button Course Item')
                    }}
                  />
                ) : (
                  <div className="action relative flex h-8 items-center justify-end"></div>
                )}
                {/* )} */}
              </div>
            </div>
            <ResultRowsModal open={open} setOpen={setOpen} />
          </div>
        </div>
      )}
      <PopupExtend
        open={openExtend}
        setOpen={setOpenExtend}
        extendCourse={extendCourse}
        extend_count={student?.extend_count}
      />
      <PopupActive
        time={timeActive}
        open={openActive}
        setOpen={setOpenActive}
        activeCourse={activeCourse}
      />
      <PopupLesson open={openLesson} setOpen={setOpenLesson} />
      <PopupOpenClass
        open={openClass}
        setOpen={setOpenClass}
        started_at={classInstance?.class_user_instances?.[0]?.started_at}
      />
      <ModalFoundationCompleted
        openContinue={openContinue}
        handleSkipCourse={handleSkipCourse}
        handleContinueFoundation={handleContinueFoundation}
      />
    </>
  )
}

export default Course
