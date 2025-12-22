import TooltipCourses from '@components/courses/shared/Tooltip'
import CourseDescriptionText from './CourseDescriptionText'
import { ICourseDescription } from 'src/type/courses-3-level/course'

export default function CourseDescription({
  course,
  enableCourse,
}: ICourseDescription) {
  return (
    <div className="des mb-7 mt-8 ">
      {course?.description?.length > 250 ? (
        <TooltipCourses
          title={
            <CourseDescriptionText
              description={course?.description}
              enableCourse={enableCourse}
              isTooltip
            />
          }
          color="#ffffff"
          placement="bottom"
        >
          <CourseDescriptionText
            description={course?.description}
            enableCourse={enableCourse}
          />
        </TooltipCourses>
      ) : (
        <CourseDescriptionText
          description={course?.description}
          enableCourse={enableCourse}
        />
      )}
    </div>
  )
}
