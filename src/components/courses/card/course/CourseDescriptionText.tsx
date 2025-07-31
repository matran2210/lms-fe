import { clearStylesHtml } from '@utils/index'
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
          'line-clamp-3 h-[72px] text-ellipsis text-base': !isTooltip,
        },
        enableCourse ? 'text-bw-15' : 'text-gray-2',
      )}
    />
  )
}
