import { Icon } from '@lms/assets'
import { ICourseProgress } from 'src/type/courses-3-level/course'

export default function CourseProgress({
  enableCourse,
  iconType,
  showStatus,
  progressPart,
}: ICourseProgress) {
  const textColorClass = enableCourse ? 'text-gray-700' : 'text-secondary-100'

  return (
    <div className="progress mb-6 h-8">
      <div className="info mb-2 flex items-center justify-between">
        <div className="text flex items-center">
          <Icon
            type={enableCourse ? iconType : 'expired'}
            className={`relative ${textColorClass}`}
          />
          <p className={`text-sm font-normal ${textColorClass} ml-px pl-2`}>
            {enableCourse ? showStatus : 'Expired'}
          </p>
        </div>
        <div className="number">
          <p className={`text-sm font-normal ${textColorClass}`}>
            {progressPart}%
          </p>
        </div>
      </div>
      <div className="progressbar h-1.5 rounded-[100px] bg-gray-200">
        <div
          className={`progress-percentage ${
            enableCourse ? 'bg-primary ' : 'bg-secondary-100'
          } h-1.5 rounded-100`}
          style={{ width: `${progressPart}%` }}
        ></div>
      </div>
    </div>
  )
}
