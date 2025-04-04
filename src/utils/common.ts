import dayjs from 'dayjs'
import { DAYS_IN_WEEK } from 'src/constants'

export const formatDate = (
  date: Date | string,
  formatStr: string = 'DD/MM/YYYY',
) => {
  return dayjs(date).format(formatStr)
}

export const cleanParams = <T extends Record<string, any>>(
  params: T,
): {
  [K in keyof T]: NonNullable<T[K]>
} => {
  const result: any = {}
  for (const [key, value] of Object.entries(params)) {
    if (
      ![null, undefined, ''].includes(value) ||
      (Array.isArray(value) && value.length)
    ) {
      result[key] = value
    }
  }
  return result
}

export const getDayIndex = (startDate: Date) =>
  (Number(dayjs(startDate).format('d')) + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK

export const reverseDaysOfWeek = (startDate: Date, daysOfWeek: number[]) => {
  const dayOfWeek = getDayIndex(startDate) + 1 // Day of week starts from 0 (Sunday)
  const dayIndex = daysOfWeek.indexOf(dayOfWeek)
  return [...daysOfWeek.slice(dayIndex), ...daysOfWeek.slice(0, dayIndex)]
}
