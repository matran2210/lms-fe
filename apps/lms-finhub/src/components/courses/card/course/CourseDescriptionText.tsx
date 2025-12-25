import { clearStylesHtml } from '@lms/utils'
import clsx from 'clsx'

interface ICourseDescriptionTextProps {
  description: string
  enableCourse: boolean
  isTooltip?: boolean
}

export default function CourseDescriptionText({
  description,
  enableCourse,
  isTooltip = false,
}: ICourseDescriptionTextProps) {
  return (
    <p
      dangerouslySetInnerHTML={{
        __html: clearStylesHtml(description),
      }}
      className={clsx(
        {
          'line-clamp-4 h-[80px] lg:line-clamp-3 lg:h-[72px] text-ellipsis text-ssm lg:text-base':
            !isTooltip,
        },
        enableCourse ? 'text-bw-15' : 'text-gray-2',
      )}
    />
  )
}
