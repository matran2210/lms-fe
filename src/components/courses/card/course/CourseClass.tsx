import { Alarm, Bachelor } from '@components/courses/icons'
import TooltipCourses from '@components/courses/shared/Tooltip'
import { truncateString } from '@utils/index'
import { ICourseClassDay } from 'src/type/courses-3-level/course'

export default function CourseClass({
  course,
  enableCourse,
  daysDifference,
  determineButtonToShow,
}: ICourseClassDay) {
  const textColorClass = enableCourse ? 'text-bw-15' : 'text-gray-2'
  return (
    <>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center justify-center text-medium-sm ${textColorClass}`}
        >
          <Bachelor />
          <span className={`ml-2 mt-1 font-medium ${textColorClass}`}>
            <TooltipCourses
              title={course?.classes?.[0]?.code}
              showTooltip={course?.classes?.[0]?.code?.length > 15}
            >
              {truncateString(course?.classes?.[0]?.code, 15)}
            </TooltipCourses>
          </span>
        </div>
        <div className={`time-class text-medium-sm ${textColorClass}`}>
          {determineButtonToShow !== 'Active' && (
            <span className="flex items-center justify-center">
              <Alarm />
              <span className={`ml-1 mt-1 font-medium ${textColorClass}`}>
                {daysDifference > 0 ? daysDifference : enableCourse ? 1 : 0}
                {'  '}
              </span>
              <span
                className={`mt-1 pl-1 ${enableCourse ? 'text-gray-1' : 'text-gray-2'}`}
              >
                {daysDifference > 1 ? 'days left' : 'day left'}
              </span>
            </span>
          )}
        </div>
      </div>
    </>
  )
}
