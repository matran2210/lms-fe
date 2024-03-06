import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays, startOfDay } from 'date-fns'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'
import {
  TITLE_USER_STATUS,
  BUTTON_STATUS,
  COURSE_STATUS,
  CLASS_STATUS,
} from 'src/constants'
import PopupExtend from './PopupExtend'
import PopupActive from './PopupActive'
import PopupLesson from './PopupLesson'
import CourseAPI from 'src/pages/api/courses'
import toast from 'react-hot-toast'
import { ICourseAll } from 'src/type/courses'
import { buildQueryString } from '@utils/index'
import { convertHourToDayLeft, convertLocalTimeToUTC } from '@utils/helpers'
import { Tooltip } from 'antd'

const Course = ({
  course,
  index,
  setData,
  setLoading,
}: {
  course: ICourse
  index: number
  setData: Dispatch<SetStateAction<ICourseAll>>
  setLoading: Dispatch<SetStateAction<boolean>>
}) => {
  const [open, setOpen] = useState<boolean>(false)
  const [openExtend, setOpenExtend] = useState<boolean>(false)
  const [openActive, setOpenActive] = useState<boolean>(false)
  const [timeActive, setTimeActive] = useState<number>()
  const [openLesson, setOpenLesson] = useState<boolean>(false)
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

  // Function để hiển thị status của course
  const checkStatusCourse = () => {
    const courseStatus = course?.status
    const classStatus = classInstance?.status
    const classType = classInstance?.course_type
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
            // const classFinish = startOfDay(getISOFinish.setUTCHours(0, 0, 0, 0))
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
          // const parsedSpecificDate = parseISO(student?.finished_at as any)
          // parsedSpecificDate.setUTCHours(0, 0, 0, 0)
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
      courseStatus === COURSE_STATUS.BLOCK
    )
      return BUTTON_STATUS.Hidden
    return BUTTON_STATUS.Hidden
  }
  const determineButtonToShow = checkStatusCourse() as any

  // Set active course dựa theo trạng thái của học viên
  const renderStatusUser = (status: string) => {
    switch (status) {
      case `${TITLE_USER_STATUS.RESERVED}`:
        return false
        break
      case `${TITLE_USER_STATUS.TRANSFER_TO}`:
        return false
        break
      case `${TITLE_USER_STATUS.CANCELED}`:
        return false
        break
      default:
        return true
    }
  }
  const isActiveStudent = renderStatusUser(student?.type ?? '')

  // Action của button trong course list
  const queryString = buildQueryString({
    name: router.query.name || '',
    status: router.query.status || '',
    type: router.query.type || '',
  })

  async function fetchCourseList() {
    setLoading(true)
    try {
      const newData = await CourseAPI.getCourse(18, queryString)
      setData(newData?.data)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  async function activeCourse() {
    try {
      const params = {
        classId: `${classInstance?.id}`,
      }
      const res = await CourseAPI.activeCourse(params)
      await fetchCourseList()
      toast.success('Active thành công!')
    } catch (error) {}
  }

  async function extendCourse() {
    try {
      const params = {
        classId: `${classInstance?.id}`,
      }
      if (
        course?.course_type === 'TRIAL_COURSE' &&
        !student &&
        classInstance?.duration_type === 'FIXED'
      ) {
        Object.assign(params, {
          is_student_in_class: false,
        })
      }
      const res = await CourseAPI.extendCourse(params)
      await fetchCourseList()
      toast.success('Gia hạn hành công!')
    } catch (error) {}
  }

  const courseAction = () => {
    if (classInstance?.type === 'LESSON' && student?.is_passed === false) {
      setOpenLesson(true)
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
      student?.extend_count === 0 || !student
        ? extendCourse()
        : setOpenExtend(true)
    } else {
      course.status !== CLASS_USER_STATUS.CANCELED
        ? router.push(`/courses/my-course/${course.id}`)
        : {}
    }
  }

  // Set enable course dựa theo trạng thái của course
  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as any

  const classUserStatus = student?.status
  const showStatus = statusMap[classUserStatus]
  const enableCourse =
    determineButtonToShow !== 'Disabled' && determineButtonToShow !== 'Extend'

  // Set active course dựa theo trạng thái của học viên
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
  const iconType = renderStatusIcon(classUserStatus ?? '')

  return (
    <>
      {determineButtonToShow !== 'Hidden' && (
        <div
          key={index}
          className={`item bg-white p-7.5 shadow-sidebar flex flex-col`}
        >
          <div className="cursor-pointer min-h-352 flex flex-col">
            <div
              className={`name-course text-2xl font-medium mb-4 xl:h-[60px] ${
                !enableCourse ? 'text-gray-2' : 'text-bw-1'
              }`}
              onClick={() => {
                if (isActiveStudent && enableCourse) {
                  courseAction()
                }
              }}
            >
              <div className="line-clamp-2 text-ellipsis">
                {(course?.name as string)?.length > 50 ? (
                  <Tooltip title={course?.name} color="#ffffff" placement="top">
                    {truncateString(course?.name, 50)}
                  </Tooltip>
                ) : (
                  <>{course?.name}</>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              {enableCourse ? (
                <div className="name-class text-medium-sm text-gray-1">
                  Class:
                  <span className="ml-1 text-bw-1 font-medium">
                    {truncateString(course?.classes?.[0]?.code, 15)}
                  </span>
                </div>
              ) : (
                <div className="name-class text-medium-sm text-gray-1">
                  <span className="ml-1 text-bw-1 font-medium" />
                </div>
              )}
              <div className="time-class text-medium-sm text-gray-1">
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
            <div className="des mt-6 mb-8 line-clamp-5 text-ellipsis h-[116px]">
              {(course?.description as string).length > 250 ? (
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
                    className={`text-bas h-24 ${
                      enableCourse ? 'text-bw-1' : 'text-gray-1 '
                    }`}
                  />
                </Tooltip>
              ) : (
                <p
                  dangerouslySetInnerHTML={{
                    __html: course?.description,
                  }}
                  className={`text-bas h-24 ${
                    enableCourse ? 'text-bw-1' : 'text-gray-1 '
                  }`}
                />
              )}
            </div>
            <div className="mt-auto">
              <div className="progress mb-6 h-8">
                <div className="info flex items-center justify-between mb-2">
                  <div className="text flex items-baseline">
                    <Icon
                      type={enableCourse ? iconType : 'expired'}
                      className={`relative top-0.5 ${
                        enableCourse ? 'text-bw-1' : 'text-gray-2'
                      }`}
                    />
                    <p
                      className={`text-medium-sm font-medium ${
                        enableCourse ? 'text-bw-1' : 'text-gray-2 '
                      } pl-1 ml-px`}
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
                      {percentProgress}%
                    </p>
                  </div>
                </div>
                <div className="progressbar bg-gray-3 h-1.5">
                  <div
                    className={`progress-percentage ${
                      enableCourse ? 'bg-primary ' : 'bg-gray-2'
                    } h-1.5`}
                    style={{ width: `${percentProgress}%` }}
                  ></div>
                </div>
              </div>
              <div className="action flex items-center justify-end relative">
                {/* {'changeExam' && (
                  <a className="underline capitalize block text-bw-1 text-medium-sm font-semibold">
                    {'changeExam'}
                  </a>
                )} */}
                {/* {'buttonText' && ( */}
                {determineButtonToShow !== 'Disabled' ? (
                  <ButtonSecondary
                    title={
                      determineButtonToShow === 'Active'
                        ? 'Activate'
                        : determineButtonToShow
                    }
                    full={false}
                    size={'small'}
                    className="hover:bg-primary hover:text-white ml-auto"
                    onClick={() => {
                      if (isActiveStudent) {
                        courseAction()
                      }
                    }}
                  />
                ) : (
                  <div className="action flex items-center justify-end relative h-8"></div>
                )}
                {/* )} */}
              </div>
            </div>
            <ResultRowsModal open={open} setOpen={setOpen} />
          </div>
        </div>
      )}
      <PopupExtend open={openExtend} setOpen={setOpenExtend} />
      <PopupActive
        time={timeActive}
        open={openActive}
        setOpen={setOpenActive}
        activeCourse={activeCourse}
      />
      <PopupLesson open={openLesson} setOpen={setOpenLesson} />
    </>
  )
}

export default Course
