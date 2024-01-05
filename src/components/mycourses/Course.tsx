import React, { useEffect, useState, Dispatch, SetStateAction } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays } from 'date-fns'
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
import CourseAPI from 'src/pages/api/courses'
import toast from 'react-hot-toast'
import { ICourseAll } from 'src/type/courses'
import { buildQueryString } from '@utils/index'

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
  // const handleOnClick = () => {
  //   setOpen(true)
  // }
  const router = useRouter()
  const student = course?.classes[0]?.class_user_instances[0]
  const classInstance = course?.classes[0]
  const [daysDifference, setDaysDifference] = useState(0)

  useEffect(() => {
    if (course?.classes?.[0].finished_at) {
      // Current date
      const currentDate = new Date()

      // Parse the specific date string to a Date object
      const parsedSpecificDate = parseISO(
        course?.classes?.[0]?.finished_at as any,
      )

      // Calculate the difference in days
      const difference = differenceInDays(
        parsedSpecificDate,
        currentDate,
      ) as any

      // Update state with the difference
      setDaysDifference(difference)
    }
  }, [])
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

    if (
      courseStatus === COURSE_STATUS.PUBLISH ||
      courseStatus === COURSE_STATUS.LOCK
    ) {
      if (classStatus === CLASS_STATUS.PUBLIC) {
        if (course?.course_type === 'TRIAL_COURSE' && !student)
          return BUTTON_STATUS.Active
        if (!startedAt && !finishedAt) {
          if (classInstance?.duration_type === 'FLEXIBLE')
            return BUTTON_STATUS.Active
          else return BUTTON_STATUS.Disabled // Thông báo lỗi học viên không có trong lớp
        }
        if (startedAt && finishedAt) {
          if (studentStatus === 'READY_TO_LEARN') return BUTTON_STATUS.Begin
          if (studentStatus === 'IN_PROGRESS') return BUTTON_STATUS.Resume
          if (studentStatus === 'COMPLETED') return BUTTON_STATUS.Review
          if (
            course?.course_type === 'TRIAL_COURSE' &&
            student.extend_count === 0
          )
            return BUTTON_STATUS.Extend
          else return BUTTON_STATUS.Disabled
        }
        return BUTTON_STATUS.Disabled
      }
      if (classStatus === CLASS_STATUS.ENDED) return BUTTON_STATUS.Disabled // Lớp đã kết thúc
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
      const newData = await CourseAPI.getCourse(1, queryString)
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
      const res = await CourseAPI.extendCourse(params)
      await fetchCourseList()
      toast.success('Gia hạn hành công!')
    } catch (error) {}
  }

  const courseAction = () => {
    if (determineButtonToShow === 'Active') {
      setOpenActive(true)
    } else if (determineButtonToShow === 'Active') {
      student.extend_count === 0 ? extendCourse() : setOpenExtend(true)
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

  const classUserStatus =
    course?.classes?.[0]?.class_user_instances?.[0]?.status
  const showStatus = statusMap[classUserStatus]
  const enableCourse = determineButtonToShow !== 'Disabled'

  return (
    <>
      {determineButtonToShow !== 'Hidden' && (
        <div
          key={index}
          className={`item bg-white p-7.5 shadow-sidebar flex flex-col`}
        >
          <div className="cursor-pointer min-h-352 flex flex-col">
            <div
              className={`name-course text-2xl font-semibold mb-4 xl:h-[60px] ${
                !enableCourse ? 'text-gray-2' : 'text-bw-1'
              }`}
              onClick={() => {
                if (isActiveStudent) {
                  courseAction()
                }
              }}
            >
              <div>{truncateString(course?.name, 40)}</div>
            </div>
            <div className="flex justify-between items-center">
              {enableCourse ? (
                <div className="name-class text-medium-sm text-gray-1">
                  Class:
                  <span className="ml-1 text-bw-1 font-medium">
                    {truncateString(course?.classes?.[0]?.name, 15)}
                  </span>
                </div>
              ) : (
                <div className="name-class text-medium-sm text-gray-1">
                  <span className="ml-1 text-bw-1 font-medium" />
                </div>
              )}
              <div className="time-class text-medium-sm text-gray-1">
                <span>
                  <span className="font-medium text-bw-1">
                    {daysDifference > 0 ? daysDifference : 0 ?? 0}{' '}
                  </span>
                  {daysDifference > 0 ? 'days left' : 'day left'}
                </span>
              </div>
            </div>
            <div className="des mt-6 mb-8">
              <p
                dangerouslySetInnerHTML={{
                  __html: truncateString(course?.description, 150),
                }}
                className={`text-bas h-24 ${
                  enableCourse ? 'text-bw-1' : 'text-gray-1 '
                }`}
              />
            </div>
            <div className="mt-auto">
              {enableCourse ? (
                <div className="progress mb-6 h-8">
                  <div className="info flex justify-between mb-2">
                    <div className="text flex items-baseline">
                      <Icon
                        type={
                          classUserStatus === CLASS_USER_STATUS.READY_TO_LEARN
                            ? 'like'
                            : classUserStatus === CLASS_USER_STATUS.IN_PROGRESS
                              ? 'hour'
                              : ''
                        }
                        className="relative top-0.5"
                      />
                      <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                        {showStatus}
                      </p>
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
              ) : (
                <div className="progress mb-6 h-8" />
              )}
              <div className="action flex items-center justify-end relative">
                {/* {'changeExam' && (
                  <a className="underline capitalize block text-bw-1 text-medium-sm font-semibold">
                    {'changeExam'}
                  </a>
                )} */}
                {/* {'buttonText' && ( */}
                {determineButtonToShow !== 'Disabled' && (
                  <ButtonSecondary
                    title={determineButtonToShow}
                    full={false}
                    size={'small'}
                    className="hover:bg-primary hover:text-white ml-auto"
                    onClick={() => {
                      if (isActiveStudent) {
                        courseAction()
                      }
                    }}
                  />
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
        open={openActive}
        setOpen={setOpenActive}
        activeCourse={activeCourse}
      />
    </>
  )
}

export default Course
