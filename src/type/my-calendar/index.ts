import { IEvent } from 'sapp-common-package/dist/types'
import {
  FREQUENCY_UNITS,
  FREQUENCY_UNITS_OBJECT,
  REPEAT_ON,
} from 'src/constants'

export interface INewSchedule {
  event_name: string
  range: {
    start_date: Date
    end_date: Date
  }
  repeat: {
    repeat: boolean
    recurring_schedule: {
      interval: number
      frequency: string
      recurrence_end_date: Date
      day_of_week: number[]
    }
  }
  description: string
}

export interface IPopupDetails {
  date: Date
  events: IEvent[]
}

export interface IRecurringSchedule {
  interval: number
  frequency: keyof typeof FREQUENCY_UNITS_OBJECT
  recurrence_end_date: Date
  day_of_week?: number[]
  month_of_year?: number[]
  day_of_month?: number[]
  type: string
}

export interface IEventRepeatFieldValues {
  repeat: boolean
  recurring_schedule: IRecurringSchedule
}

export interface IRepeatFrequency {
  interval: number
  unit: FREQUENCY_UNITS
}

export interface IRepeatUnitOption {
  label: string
  value: FREQUENCY_UNITS
}
