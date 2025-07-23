import Icon from '@components/icons'
import { ICourseProgress } from 'src/type/courses-3-level/course'

export default function CourseProgress({
  enableCourse,
  iconType,
  showStatus,
  progressPart,
}: ICourseProgress) {
  const textColorClass = enableCourse ? 'text-bw-15' : 'text-gray-2'

  return (
    <div className="progress mb-6 h-8">
      <div className="info mb-2 flex items-center justify-between">
        <div className="text flex items-center">
          <Icon
            type={enableCourse ? iconType : 'expired'}
            className={`relative ${textColorClass}`}
          />
          <p
            className={`text-medium-sm font-medium ${textColorClass} ml-px pl-2`}
          >
            {enableCourse ? showStatus : 'Expired'}
          </p>
        </div>
        <div className="number">
          <p className={`text-medium-sm font-medium ${textColorClass}`}>
            {progressPart}%
          </p>
        </div>
      </div>
      <div className="progressbar h-1.5 bg-gray-3">
        <div
          className={`progress-percentage ${
            enableCourse ? 'bg-primary ' : 'bg-gray-2'
          } h-1.5`}
          style={{ width: `${progressPart}%` }}
        ></div>
      </div>
    </div>
  )
}
