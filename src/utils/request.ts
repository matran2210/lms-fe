import dayjs from 'dayjs'
import { UseFormGetValues } from 'react-hook-form'
import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants'
import {
  IBusySchedule,
  IRecurringSchedule,
  IRequest,
} from 'src/type/my-request'
import {
  DAYS_IN_WEEK,
  REPEAT_FREQUENCY,
  REPEAT_FREQUENCY_LABEL,
  REPEAT_TYPE,
  WEEK_DAY_LABELS,
} from './constants/repeat'

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
  [REQUEST_STATUS.APPROVED]: {
    type: 'success',
    label: 'Approved',
  },
  [REQUEST_STATUS.PENDING]: {
    type: 'warning',
    label: 'Pending',
  },
  [REQUEST_STATUS.REJECT]: {
    type: 'error',
    label: 'Rejected',
  },
  [REQUEST_STATUS.CANCEL]: {
    type: 'default',
    label: 'Canceled',
  },
} as const

export const requestTypeToTitle = {
  [REQUEST_TYPE.TEACHING_MODE]: 'Xin đổi hình thức',
  [REQUEST_TYPE.TEACHER_SCHEDULE_BUSY]: 'Busy schedule',
  [REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF]: 'Lịch nghỉ',
  [REQUEST_TYPE.TEACHER_WEEKLY_NORMS]: 'Weekly norm',
  [REQUEST_TYPE.TEACHER_OTHER]: 'Lịch khác',
} as const

export const formatRecurringSchedule = (
  recurringSchedule: IRecurringSchedule,
) => {
  let result = `Every ${recurringSchedule.interval} ${recurringSchedule.frequency}`

  if (
    recurringSchedule.day_of_week &&
    recurringSchedule.day_of_week.length > 0
  ) {
    const days = recurringSchedule.day_of_week
      .map((day) => WEEKDAYS[day - 1])
      .join(', ')
    result += ` on ${days}`
  }

  if (recurringSchedule.end_date) {
    const endDate = dayjs(recurringSchedule.end_date).format('MMM DD, YYYY')
    result += `, until ${endDate}`
  }

  return result
}
export const getDayIndex = (startDate: Date) =>
  (Number(dayjs(startDate).format('d')) + DAYS_IN_WEEK - 1) % DAYS_IN_WEEK

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

const getRepeatEveryWeekday = (): IRecurringSchedule => ({
  interval: 1,
  frequency: 'days',
  day_of_week: [1, 2, 3, 4, 5],
  type: REPEAT_TYPE.EVERY_WEEKDAY,
})
export const getCustomRepeat = (
  getValues: UseFormGetValues<any>,
  startDate: Date,
): IRecurringSchedule => {
  const repeatCustom: IRecurringSchedule = {
    interval: Number(
      getValues('request_busy_schedule.0.recurring_schedule.interval'),
    ),
    frequency:
      REPEAT_FREQUENCY_LABEL[
        getValues(
          'request_busy_schedule.0.recurring_schedule.frequency',
        )?.toUpperCase() as REPEAT_FREQUENCY
      ],
    type: REPEAT_TYPE.CUSTOM,
  }

  switch (
    getValues(
      'request_busy_schedule.0.recurring_schedule.frequency',
    )?.toUpperCase()
  ) {
    case REPEAT_FREQUENCY.WEEK:
      repeatCustom.day_of_week = getValues(
        `request_busy_schedule.0.recurring_schedule.day_of_week`,
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
  switch (getValues('request_busy_schedule.0.recurring_schedule.type')) {
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
      result = getRepeatEveryWeekday()
      break
    case REPEAT_TYPE.CUSTOM:
      result = getCustomRepeat(getValues, startDate)
      break
    default:
      result = getRepeatDaily()
  }
  const repeatEndOn = getValues(
    'request_busy_schedule.0.recurring_schedule.recurrence_end_date',
  )

  return {
    ...result,
    recurrence_end_date: repeatEndOn
      ? dayjs.utc(repeatEndOn).endOf('day').format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      : null,
  }
}
