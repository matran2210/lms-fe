import Badge from '@components/courses/card/Badge'
import {
  COURSES_STATUS_BADGE,
  COURSES_STATUS_LABEL,
} from 'src/constants/courses3level/courses'
import { PlayIcon, TextIcon, ListIcon } from '@components/courses/icons'
import { PastExamAnalysisIcon } from '@components/courses/icons/PastExamAnalysisIcon'

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0 && remainingMinutes > 0)
    return `${hours} ${hours > 1 ? 'hours' : 'hour'} ${remainingMinutes} mins`
  if (hours > 0 && remainingMinutes === 0) return `${hours} hour`
  return `${remainingMinutes}m`
}

export const badgeMap: Partial<
  Record<string, { badgeType: string; label: string }>
> = {
  Finished: {
    badgeType: COURSES_STATUS_BADGE['FINISH'],
    label: COURSES_STATUS_LABEL['FINISH'],
  },
  Learning: {
    badgeType: COURSES_STATUS_BADGE['LEARNING'],
    label: COURSES_STATUS_LABEL['LEARNING'],
  },
}

export const renderBadge = (status: string) => {
  const badgeConfig = badgeMap[status]
  if (!badgeConfig) return null
  return <Badge badgeType={badgeConfig.badgeType} label={badgeConfig.label} />
}

const activityIconMap: Record<string, JSX.Element> = {
  VIDEO: <PlayIcon className="w-4.5 md:w-6" />,
  TEXT: <TextIcon className="w-4.5 md:w-6" />,
  QUIZ: <ListIcon className="w-4.5 md:w-6" />,
  TEST: <ListIcon className="w-4.5 md:w-6" />,
  PAST_EXAM_ANALYSIS: <PastExamAnalysisIcon className="w-4.5 md:w-6" />,
}

export const renderIconActivity = (type: string) => {
  return activityIconMap[type] || null
}
