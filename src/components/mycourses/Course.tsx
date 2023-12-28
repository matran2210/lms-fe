import React, { useEffect, useState } from 'react'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays } from 'date-fns'
import { round } from 'lodash'
import { useRouter } from 'next/router'
import { CLASS_USER_STATUS } from 'src/type/courses'

const Course = ({ course }: { course: any }) => {
  const [open, setOpen] = useState<boolean>(false)
  // const handleOnClick = () => {
  //   setOpen(true)
  // }
  const router = useRouter()

  const [daysDifference, setDaysDifference] = useState(0)

  useEffect(() => {
    if (course?.finished_at) {
      // Current date
      const currentDate = new Date()

      // Parse the specific date string to a Date object
      const parsedSpecificDate = parseISO(course?.finished_at as any)

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
    (course?.learning_progress?.total_course_sections_completed /
      course?.learning_progress?.total_course_sections) *
      100,
    2,
  )

  const showStatus =
    course?.status === CLASS_USER_STATUS.READY_TO_LEARN
      ? 'Ready to learn'
      : course?.status === CLASS_USER_STATUS.COMPLETED
        ? 'Completed'
        : course?.status === CLASS_USER_STATUS.IN_PROGRESS
          ? 'In progress'
          : 'Expired'
  const showTextButton =
    course?.status === CLASS_USER_STATUS.READY_TO_LEARN
      ? 'Active'
      : course?.status === CLASS_USER_STATUS.COMPLETED
        ? 'Review'
        : course?.status === CLASS_USER_STATUS.IN_PROGRESS
          ? 'Resume'
          : course?.status === CLASS_USER_STATUS.CANCELED &&
              course?.course_type === 'TRIAL_COURSE'
            ? 'Extend'
            : ''

  return (
    <div className="cursor-pointer">
      <div
        className={`name-course text-2xl font-semibold mb-4 xl:h-[60px] ${
          course?.status === CLASS_USER_STATUS.CANCELED
            ? 'text-gray-2'
            : 'text-bw-1'
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
        {course?.status !== CLASS_USER_STATUS.CANCELED ? (
          <div className="name-class text-medium-sm text-gray-1">
            Class:
            <span className="ml-1 text-bw-1 font-medium">
              {truncateString(course?.class, 15)}
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
            __html: truncateString(course?.description, 70),
          }}
          className={`text-bas h-20  ${
            course?.status !== CLASS_USER_STATUS.CANCELED
              ? 'text-bw-1'
              : 'text-gray-1 '
          }`}
        />
      </div>
      <div className="mt-auto">
        {course.status !== CLASS_USER_STATUS.CANCELED ? (
          <div className="progress mb-6 h-8">
            <div className="info flex justify-between mb-2">
              <div className="text flex items-baseline">
                <Icon
                  type={
                    course?.status === CLASS_USER_STATUS.READY_TO_LEARN
                      ? 'like'
                      : course.status === CLASS_USER_STATUS.IN_PROGRESS
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
            title={showTextButton}
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
