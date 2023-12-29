import React, { useEffect, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays } from 'date-fns'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { CLASS_USER_STATUS, ICourse } from 'src/type/courses'

const Course = ({ course }: { course: ICourse }) => {
  const [open, setOpen] = useState<boolean>(false)
  // const handleOnClick = () => {
  //   setOpen(true)
  // }
  const router = useRouter()

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

  // const showStatus =
  //   course?.classes?.[0]?.class_user_instances?.[0]?.status === CLASS_USER_STATUS.READY_TO_LEARN
  //     ? 'Ready to learn'
  //     : course?.classes?.[0]?.class_user_instances?.[0]?.status === CLASS_USER_STATUS.COMPLETED
  //       ? 'Completed'
  //       : course?.classes?.[0]?.class_user_instances?.[0]?.status === CLASS_USER_STATUS.IN_PROGRESS
  //         ? 'In progress'
  //         : 'Expired'

  const statusMap = {
    [CLASS_USER_STATUS.READY_TO_LEARN]: 'Ready to learn',
    [CLASS_USER_STATUS.COMPLETED]: 'Completed',
    [CLASS_USER_STATUS.IN_PROGRESS]: 'In progress',
    [CLASS_USER_STATUS.CANCELED]: '',
  } as any

  const classUserStatus =
    course?.classes?.[0]?.class_user_instances?.[0]?.status
  const showStatus = statusMap[classUserStatus]

  const enableCourse = classUserStatus !== CLASS_USER_STATUS.CANCELED

  return (
    <div className="cursor-pointer">
      <div
        className={`name-course text-2xl font-semibold mb-4 xl:h-[60px] ${
          !enableCourse ? 'text-gray-2' : 'text-bw-1'
        }`}
        onClick={() =>
          course.status !== CLASS_USER_STATUS.CANCELED
            ? router.push(`/courses/my-course/${course.id}`)
            : {}
        }
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
            onClick={() =>
              course.status !== CLASS_USER_STATUS.CANCELED
                ? router.push(`/courses/my-course/${course.id}`)
                : {}
            }
          />
          {/* )} */}
        </div>
      </div>
      <ResultRowsModal open={open} setOpen={setOpen} />
    </div>
  )
}

export default Course
