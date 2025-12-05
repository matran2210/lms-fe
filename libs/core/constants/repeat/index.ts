import { REPEAT_FREQUENCY } from "../../enums"

export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export const REPEAT_FREQUENCY_LABEL = {
  [REPEAT_FREQUENCY.DAY]: 'days',
  [REPEAT_FREQUENCY.WEEK]: 'weeks',
  [REPEAT_FREQUENCY.MONTH]: 'months',
  [REPEAT_FREQUENCY.YEAR]: 'years',
} as const
export const WEEK_DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
