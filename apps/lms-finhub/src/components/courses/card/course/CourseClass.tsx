import { Bachelor, CourseTimeIcon } from '@components/courses/icons'
import TooltipCourses from '@components/courses/shared/Tooltip'
import { useTailwindBreakpoint } from '@lms/hooks'
import { truncateString } from '@lms/utils'
import { ICourseClassDay } from 'src/type/courses-3-level/course'

export default function CourseClass({
  course,
  enableCourse,
  determineButtonToShow,
  daysDifference = 0,
}: ICourseClassDay) {
  const { isDesktopView } = useTailwindBreakpoint()
  const textColorClass = enableCourse ? 'text-gray-800' : 'text-secondary-100'
  const maxLengthTitle = isDesktopView ? 25 : 15
  const sizeIcon = 'h-5 w-5 md:h-[1.25rem] md:w-[1.25rem]'
  return (
    <>
      <div className="flex items-center justify-between">
        <div
          className={`flex items-center justify-center text-sm ${textColorClass}`}
        >
          <Bachelor />
          <span className={`ml-2 mt-1 font-medium ${textColorClass}`}>
            <TooltipCourses
              title={course?.classes?.[0]?.code}
              showTooltip={course?.classes?.[0]?.code?.length > maxLengthTitle}
            >
              {truncateString(course?.classes?.[0]?.code, maxLengthTitle)}
            </TooltipCourses>
          </span>
        </div>
        {determineButtonToShow !== 'Active' &&
          course?.course_type === 'TRIAL_COURSE' && (
            <div className="flex items-center gap-1">
              <div
                className={`mr-1 ${enableCourse ? 'text-icon' : 'text-gray-300'}`}
              >
                <CourseTimeIcon className={sizeIcon} />
              </div>
              <div
                className={`text-xs font-medium md:text-sm ${
                  enableCourse ? 'text-icon' : 'text-gray-300'
                }`}
              >
                {daysDifference > 0
                  ? daysDifference
                  : enableCourse
                    ? 1
                    : 0}{' '}
              </div>
              <div
                className={`text-xs font-normal md:text-sm ${enableCourse ? 'text-gray' : 'text-gray-300'}`}
              >
                {daysDifference > 1 ? 'days left' : 'day left'}
              </div>
            </div>
          )}
      </div>
    </>
  )
}
