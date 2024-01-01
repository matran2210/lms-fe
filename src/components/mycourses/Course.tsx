import React, { useEffect, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays } from 'date-fns'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'
import { TITLE_USER_STATUS } from 'src/constants'

const Course = ({ course }: { course: ICourse }) => {
  const [open, setOpen] = useState<boolean>(false)
  // const handleOnClick = () => {
  //   setOpen(true)
  // }
  const router = useRouter()
  const student = course?.classes[0]?.class_user_instances[0]
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

  const percentProgress = round(
    (course?.classes?.[0]?.class_user_instances?.[0]?.learning_progress
      ?.total_course_sections_completed ||
      0 /
        course?.classes?.[0]?.class_user_instances?.[0]?.learning_progress
          ?.total_course_sections ||
      0) * 100,
    2,
  )

  // TODO: Function để hiển thị status của course, 1 số ý chưa rõ nên để bản nháp ở đây trước
  const checkStatusCourse = () => {
    const class_instance = course?.classes[0]
    const course_instance = course

    if (!class_instance) {
      // Lớp học không tồn tại, thông báo lỗi 404
      return '404 - Class does not exist'
    }

    if (!student) {
      if (course_instance?.course_type === 'TRIAL_COURSE') {
        // Hiển thị button Activate để thêm học viên vào lớp và cho nó học
        return 'Activate'
      }

      // Thông báo lỗi không có học viên
      return 'No student found'
    }

    if (class_instance?.status === 'BLOCKED') {
      // Lớp học đang bị khoá, không hiển thị button, bôi xám hết, nếu nó dùng url thì thông báo lỗi là lớp học đang bị BLOCK
      return 'Class is blocked'
    }

    if (class_instance?.status === 'DRAFT') {
      // thông báo lỗi 404 là lớp học không tồn tại (đề phòng vụ dùng url)
      return '404 - Class does not exist'
    }

    if (!student?.finished_at) {
      if (class_instance?.duration_type === 'FIXED') {
        // Thông báo lỗi học viên không có trong lớp
        return 'Student not found in the class'
      }

      if (class_instance?.duration_type === 'FLEXIBLE') {
        // Hiển thị button Activate khoá học
        return 'Activate'
      }
    }

    if (student?.finished_at < new Date()) {
      if (
        course_instance?.course_type === 'TRIAL_COURSE' &&
        student?.status === 'CANCELED'
      ) {
        if (student?.extend_count <= 2) {
          // Hiển thị button Extend
          return 'Extend'
        }
      }
      // Thông báo lỗi đã hết thời gian học
      return 'Course time has ended'
    }

    if (class_instance?.type === 'FOUNDATION') {
      if (!student?.is_passed) {
        if (student?.status === 'READY_TO_LEARN') {
          // Hiển thị button Active (lớp FLEXIBLE)
          // Hiển thị button Begin (lớp FIXED)
          return 'Active or Begin'
        }
        if (student?.status === 'IN_PROGRESS') {
          // Hiển thị button Resume
          return 'Resume'
        }
      } else {
        // Học viên đã pass khoá FOUNDATION, chỉ cho xem chứ không cho học
        return 'Student has passed Foundation course'
      }
    }

    if (student?.status === 'READY_TO_LEARN') {
      // Hiển thị button Active (lớp FLEXIBLE)
      // Hiển thị button Begin (lớp FIXED)
      return 'Active or Begin'
    }
    if (student?.status === 'IN_PROGRESS') {
      // Hiển thị button Resume
      return 'Resume'
    }
    if (student?.status === 'COMPLETED') {
      // Hiển thị button Review
      return 'Review'
    }
  }

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
  const enableCourse =
    classUserStatus !== CLASS_USER_STATUS.CANCELED && isActiveStudent

  return (
    <div className="cursor-pointer">
      <div
        className={`name-course text-2xl font-semibold mb-4 xl:h-[60px] ${
          !enableCourse ? 'text-gray-2' : 'text-bw-1'
        }`}
        onClick={() => {
          if (isActiveStudent) {
            course.status !== CLASS_USER_STATUS.CANCELED
              ? router.push(`/courses/my-course/${course.id}`)
              : {}
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
            <span className="font-medium">
              {daysDifference > 0 ? daysDifference : 0 ?? 0}{' '}
            </span>
            day left
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
          <ButtonSecondary
            title={'Begin'}
            full={false}
            size={'small'}
            className="hover:bg-primary hover:text-white ml-auto"
            onClick={() => {
              if (isActiveStudent) {
                course.status !== CLASS_USER_STATUS.CANCELED
                  ? router.push(`/courses/my-course/${course.id}`)
                  : {}
              }
            }}
          />
          {/* )} */}
        </div>
      </div>
      <ResultRowsModal open={open} setOpen={setOpen} />
    </div>
  )
}

export default Course
