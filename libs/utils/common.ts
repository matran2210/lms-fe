import dayjs, { Dayjs } from 'dayjs'
import { DAYS_IN_WEEK } from '@lms/core'
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);


export const formatDate = (
  date: Dayjs | Date | string,
  formatStr: string = 'DD/MM/YYYY',
) => {
  return dayjs(date).format(formatStr)
}

export const formatTime = (
  date: Dayjs | Date | string,
  formatStr: string = 'HH:mm',
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

/**
 * Returns the index of the weekday for a given date, adjusted for UTC.
 *
 * @param {Date} startDate - The date for which the weekday index is calculated.
 * @param {boolean} isUTC - Whether to use UTC time.
 * @returns {number} - The index of the weekday, where 0 is Monday and 6 is Sunday.
 */
export const getDayIndex = (startDate: Date, isUTC = true) => {
  const day = isUTC ? dayjs(startDate).utc().day() : dayjs(startDate).day()

  return (day + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK
}

export const reverseDaysOfWeek = (startDate: Date, daysOfWeek: number[]) => {
  const dayOfWeek = getDayIndex(startDate) + 1 // Convert start day of week from 0 to 1
  const dayIndex = daysOfWeek.indexOf(dayOfWeek)
  return [...daysOfWeek.slice(dayIndex), ...daysOfWeek.slice(0, dayIndex)]
}

export const convertLocalWeekDaysToUTC = (
  startDate: Date,
  localDaysOfWeek: number[],
) => {
  // start of week with startDate hour and minute
  const startOfWeek = dayjs(startDate)
    .startOf('week')
    .hour(startDate.getHours())
    .minute(startDate.getMinutes())

  return localDaysOfWeek.map(
    (num) => getDayIndex(startOfWeek.add(num, 'day').toDate()) + 1,
  ) // Convert start day of week from 0 to 1
}

/**
 *
 * @param date - Don't use formatDateTimeWithTimeZone(new Date('DD/MM/YYYY'), 'HH:mm') instead of formatDateTimeWithTimeZone('DD/MM/YYYY', 'HH:mm')
 * @param time
 * @returns
 */
export const formatDateTimeWithTimeZone = (
  date: Date | string | undefined,
  time: string,
): Date => {
  if (typeof date === 'string') {
    return new Date(`${date}T${time}Z`)
  }

  const startDayjs = dayjs(date).startOf('day')
  const formattedDate = startDayjs.format('YYYY-MM-DD')
  const tmpStartDate = dayjs(formattedDate + 'T' + time + 'Z')
  return startDayjs
    .set('hour', tmpStartDate.get('hour')) // Avoid time has UTC issue
    .set('minute', tmpStartDate.get('minute'))
    .toDate()
}
