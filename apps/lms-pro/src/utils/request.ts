import dayjs from 'dayjs'
import { UseFormGetValues } from 'react-hook-form'
import { E_REQUEST_STATUS, E_REQUEST_TYPE, REQUEST_STATUS, REQUEST_TYPE } from '@lms/core'
import { IRecurringSchedule } from 'src/type/my-request'
import {
  convertLocalWeekDaysToUTC,
  getDayIndex,
  reverseDaysOfWeek,
} from './common'
import {
  REPEAT_FREQUENCY,
  REPEAT_FREQUENCY_LABEL,
  REPEAT_TYPE,
} from '@lms/core'

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const requestStatusToBadge = {
  [E_REQUEST_STATUS.APPROVED]: {
    type: 'success',
    label: 'Approved',
  },
  [E_REQUEST_STATUS.PENDING]: {
    type: 'warning',
    label: 'Pending',
  },
  [E_REQUEST_STATUS.REJECT]: {
    type: 'error',
    label: 'Rejected',
  },
  [E_REQUEST_STATUS.CANCEL]: {
    type: 'default',
    label: 'Canceled',
  },
} as const

export const requestTypeToTitle = {
  [E_REQUEST_TYPE.TEACHING_MODE]: 'Xin đổi hình thức',
  [E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY]: 'Busy schedule',
  [E_REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF]: 'Lịch nghỉ',
  [E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS]: 'Weekly norm',
  [E_REQUEST_TYPE.TEACHER_OTHER]: 'Lịch khác',
} as const

export const formatRecurringSchedule = (
  recurringSchedule: IRecurringSchedule,
  firstDateOfRecurring: Date,
) => {
  let result = `Every ${recurringSchedule.interval} ${recurringSchedule.frequency}`

  if (
    recurringSchedule.day_of_week &&
    recurringSchedule.day_of_week.length > 0
  ) {
    const dayOfWeek = getDayIndex(firstDateOfRecurring, false) + 1 // Convert start day of week from 0 to 1
    const dayOfWeekUTC = recurringSchedule.day_of_week[0]
    const inSameDay = dayOfWeek === dayOfWeekUTC
    // Chỉ cần xét thứ tự các ngày trong tùân đầu tiên được lặp, các tuần tiếp theo sẽ tương tự
    const convertedDays = recurringSchedule.day_of_week
      .map((day) => {
        if (inSameDay) return day - 1 // Convert start day of week from 1 to 0

        const date = dayjs(firstDateOfRecurring)
          .add(day - dayOfWeekUTC, 'day') // Xét chênh lệch ngày giữa ngày đầu tiên và ngày làm mảng bị đảo
          .toDate()
        return getDayIndex(date, false)
      })
      .sort()

    const days = convertedDays.map((day) => WEEKDAYS[day]).join(', ')
    result += ` on ${days}`
  }

  if (recurringSchedule.recurrence_end_date || recurringSchedule.end_date) {
    const endDate = dayjs(
      recurringSchedule.recurrence_end_date || recurringSchedule.end_date,
    ).format('MMM DD, YYYY')
    result += `, until ${endDate}`
  }

  return result
}

const getRepeatDaily = (): IRecurringSchedule => ({
  interval: 1,
  frequency: 'days',
  type: REPEAT_TYPE.DAILY,
})
const getRepeatWeekly = (startDate: Date): IRecurringSchedule => ({
  interval: 1,
  frequency: 'weeks',
  day_of_week: [getDayIndex(startDate) + 1], // Day of week starts from 0 (Sunday)
  type: REPEAT_TYPE.WEEKLY,
})

const getRepeatMonthly = (startDate: Date): IRecurringSchedule => ({
  interval: 1,
  frequency: 'months',
  day_of_month: [Number(dayjs(startDate).format('D'))],
  type: REPEAT_TYPE.MONTHLY,
})

const getRepeatAnnually = (startDate: Date): IRecurringSchedule => ({
  interval: 1,
  frequency: 'years',
  month_of_year: [Number(dayjs(startDate).format('M'))],
  day_of_month: [Number(dayjs(startDate).format('D'))],
  type: REPEAT_TYPE.ANNUALLY,
})

const getRepeatEveryWeekday = (startDate: Date): IRecurringSchedule => ({
  interval: 1,
  frequency: 'days',
  day_of_week: reverseDaysOfWeek(
    startDate,
    convertLocalWeekDaysToUTC(startDate, [0, 1, 2, 3, 4]),
  ),
  type: REPEAT_TYPE.EVERY_WEEKDAY,
})

export const getCustomRepeat = (
  getValues: UseFormGetValues<any>,
  startDate: Date,
): IRecurringSchedule => {
  const repeatCustom: IRecurringSchedule = {
    interval: Number(
      getValues(
        'request_busy_schedule.0.repeat_schedule.recurring_schedule.interval',
      ),
    ),
    frequency:
      REPEAT_FREQUENCY_LABEL[
        getValues(
          'request_busy_schedule.0.repeat_schedule.recurring_schedule.frequency',
        )?.toUpperCase() as REPEAT_FREQUENCY
      ],
    type: REPEAT_TYPE.CUSTOM,
  }

  switch (
    getValues(
      'request_busy_schedule.0.repeat_schedule.recurring_schedule.frequency',
    )?.toUpperCase()
  ) {
    case REPEAT_FREQUENCY.WEEK:
      repeatCustom.day_of_week = reverseDaysOfWeek(
        startDate,
        getValues(
          `request_busy_schedule.0.repeat_schedule.recurring_schedule.day_of_week`,
        ),
      )
      break
    case REPEAT_FREQUENCY.MONTH:
      repeatCustom.day_of_month = [Number(dayjs(startDate).format('D'))]
      break
    case REPEAT_FREQUENCY.YEAR:
      repeatCustom.month_of_year = [Number(dayjs(startDate).format('M'))]
      repeatCustom.day_of_month = [Number(dayjs(startDate).format('D'))]
      break
    default:
      break
  }

  return repeatCustom
}

export const getRecurringSchedule = (
  getValues: UseFormGetValues<any>,
  startDate: Date,
): IRecurringSchedule => {
  let result: any = {}
  switch (
    getValues('request_busy_schedule.0.repeat_schedule.recurring_schedule.type')
  ) {
    case REPEAT_TYPE.DAILY:
      result = getRepeatDaily()
      break
    case REPEAT_TYPE.WEEKLY:
      result = getRepeatWeekly(startDate)
      break
    case REPEAT_TYPE.MONTHLY:
      result = getRepeatMonthly(startDate)
      break
    case REPEAT_TYPE.ANNUALLY:
      result = getRepeatAnnually(startDate)
      break
    case REPEAT_TYPE.EVERY_WEEKDAY:
      result = getRepeatEveryWeekday(startDate)
      break
    case REPEAT_TYPE.CUSTOM:
      result = getCustomRepeat(getValues, startDate)
      break
    default:
      result = getRepeatDaily()
  }
  const repeatEndOn = getValues(
    'request_busy_schedule.0.repeat_schedule.recurring_schedule.recurrence_end_date',
  )

  return {
    ...result,
    recurrence_end_date: repeatEndOn
      ? dayjs.utc(repeatEndOn).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      : null,
  }
}
