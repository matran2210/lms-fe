import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import ButtonSecondary from '@components/base/button/ButtonSecondary'
import Icon from '@components/icons'
import ResultRowsModal from '@components/learning/ResultRowsModal'
import { truncateString } from '@utils/index'
import { parseISO, differenceInDays } from "date-fns";
import { round } from "lodash";

const Course = ({course}:{course: any}) => {
  const [open, setOpen] = useState<boolean>(false)
  const handleOnClick = () => {
    setOpen(true)
  }

  const [daysDifference, setDaysDifference] = useState(0);

  useEffect(() => {
    // Current date
    const currentDate = new Date();

    // Parse the specific date string to a Date object
    const parsedSpecificDate = parseISO(course?.finished_at as any);

    // Calculate the difference in days
    const difference = differenceInDays(parsedSpecificDate, currentDate) as any

    // Update state with the difference
    setDaysDifference(difference);
  }, []);

  const percentProgress = round((course?.learning_progress?.total_course_sections_completed / course?.learning_progress?.total_course_sections) * 100, 2)

  return (
    <>
      <div
        className={`name-course text-2xl font-semibold mb-4 xl:h-[60px] ${
          'a' ? 'text-bw-1' : 'text-gray-2'
        }`}
      >
        <Link href={`/courses/${course.id}`}>{truncateString(course?.name, 40)}</Link>
      </div>
      <div className="flex justify-between items-center">
        <div className="name-class text-medium-sm text-gray-1">
          Class:
          <span className="ml-1 text-bw-1 font-medium">{truncateString(course?.class, 15)}</span>
        </div>
          <div className="time-class text-medium-sm text-gray-1">
            {'aa' ? (
              <span>
                <span className="font-medium">{daysDifference > 0 ? daysDifference : 0 ?? 0}</span> day left
              </span>
            ) : (
              <span>
                <span className="font-semibold text-bw-1">{'time'}</span>
                days left
              </span>
            )}
          </div>
      </div>
      <div className="des mt-6 mb-8">
        <p dangerouslySetInnerHTML={{__html: truncateString(course?.description,70)}} className={`text-base ${'a' ? 'text-bw-1' : 'text-gray-1'}`} />
      </div>
      <div className="mt-auto">
        {'a' && (
          <div className="progress mb-6">
            <div className="info flex justify-between mb-2">
              <div className="text flex items-baseline">
                <Icon type={'progressIconType'} className="relative top-0.5" />
                <p className="text-medium-sm font-medium text-bw-1 pl-1 ml-px">
                  {/* {course?.learning_progress?.total_course_sections} */}
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
        )}
        <div className="action flex items-center justify-end relative">
          {/* {'changeExam' && (
            <a className="underline capitalize block text-bw-1 text-medium-sm font-semibold">
              {'changeExam'}
            </a>
          )} */}
          {/* {'buttonText' && ( */}
            <ButtonSecondary
              title={'Review'}
              full={false}
              size={'small'}
              className="hover:bg-primary hover:text-white ml-auto"
              onClick={handleOnClick}
            />
          {/* )} */}
        </div>
      </div>
      <ResultRowsModal open={open} setOpen={setOpen} />
    </>
  )
}

export default Course
