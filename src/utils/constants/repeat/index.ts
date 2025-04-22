export const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
export enum REPEAT_TYPE {
  DOES_NOT_REPEAT = 'DOES_NOT_REPEAT',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUALLY = 'ANNUALLY',
  EVERY_WEEKDAY = 'EVERY_WEEKDAY',
  CUSTOM = 'CUSTOM',
  CHOSEN_PATTERN = 'CHOSEN_PATTERN',
}
export enum REPEAT_FREQUENCY {
  DAY = 'DAYS',
  WEEK = 'WEEKS',
  MONTH = 'MONTHS',
  YEAR = 'YEARS',
}
export const REPEAT_FREQUENCY_LABEL = {
  [REPEAT_FREQUENCY.DAY]: 'days',
  [REPEAT_FREQUENCY.WEEK]: 'weeks',
  [REPEAT_FREQUENCY.MONTH]: 'months',
  [REPEAT_FREQUENCY.YEAR]: 'years',
} as const
export const DAYS_IN_WEEK = 7
export const WEEK_DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
