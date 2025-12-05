import Badge from '@components/courses/card/Badge'
import { PlayIcon, TextIcon, ListIcon } from '@components/courses/icons'
import { PastExamAnalysisIcon } from '@components/courses/icons/PastExamAnalysisIcon'
import { COURSES_STATUS_BADGE, COURSES_STATUS_LABEL } from '@lms/core'

export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0 && remainingMinutes > 0) {
    const hourLabel = hours > 1 ? 'hours' : 'hour'
    const minuteLabel = remainingMinutes > 1 ? 'minutes' : 'minute'
    return `${hours} ${hourLabel} ${remainingMinutes} ${minuteLabel}`
  }

  if (hours > 0 && remainingMinutes === 0) {
    const hourLabel = hours > 1 ? 'hours' : 'hour'
    return `${hours} ${hourLabel}`
  }

  const minuteLabel = remainingMinutes > 1 ? 'minutes' : 'minute'
  return `${remainingMinutes} ${minuteLabel}`
}

export const formatDurationMenuActivity = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours > 0 && remainingMinutes > 0) return `${hours}h ${remainingMinutes}m`
  if (hours > 0 && remainingMinutes === 0) return `${hours}h`
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
