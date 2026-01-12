import TooltipCourses from '@components/courses/shared/Tooltip'
import { ICourseTitle } from '@lms/core'
import { trackGAEvent, truncateString } from '@lms/utils'

export default function CourseTitle({
  course,
  enableCourse,
  isActiveStudent,
  courseAction,
}: ICourseTitle) {
  return (
    <div
      className={`name-course mb-4 text-base font-semibold lg:text-2xl xl:h-[64px] ${
        !enableCourse ? 'text-gray-2' : 'text-bw-15'
      }`}
    >
      <div
        className="line-clamp-2 cursor-pointer text-ellipsis "
        onClick={() => {
          if (isActiveStudent && enableCourse) {
            courseAction()
          }
          trackGAEvent('Click Title Course Item')
        }}
      >
        <TooltipCourses
          title={course?.name}
          showTooltip={(course?.name as string)?.length > 50}
        >
          {truncateString(course?.name, 50)}
        </TooltipCourses>
      </div>
    </div>
  )
}
