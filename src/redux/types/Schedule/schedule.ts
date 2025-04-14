import { FREQUENCY_UNITS, REPEAT_ON } from 'src/constants'
import { RecurringScheduleType } from 'src/type/my-calendar'

export interface ICreateScheduleForm {
  event_name: string
  range: [Date, Date]
  repeat: {
    repeat: boolean
    recurring_schedule: {
      interval: number
      frequency: FREQUENCY_UNITS
      recurrence_end_date: string
      day_of_week?: (typeof REPEAT_ON)[number][]
      month_of_year?: number[]
      day_of_month?: number[]
      type: RecurringScheduleType
    }
  }
  description: string
}

export interface ICreateSchedulePayload {
  event_name: string
  event_type: 'TEACHING' | 'BUSY' | 'TIME_OFF' | 'OTHER'
  range: {
    start_time: string
    end_time: string
  }
  description: string
  repeat: boolean
  recurring_schedule?: {
    type: RecurringScheduleType
    interval: number
    frequency: 'days' | 'weeks' | 'months' | 'years'
    recurrence_end_date: string
    day_of_week?: number[]
    day_of_month?: number[]
    month_of_year?: number[]
  }
}

export interface IResponseSchedule {
  id: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  is_holiday: boolean
  name: string | null
  description: string | null
  recurring_pattern_id: string | null
  is_schedule_one_time: boolean
  is_schedule_recurring: boolean
  is_schedule_excepted: boolean
  room_type: string | null
  event_type: 'TEACHING' | 'BUSY' | 'TIME_OFF' | 'OTHER'
  classroom_address: string | null
  classroom_name: string | null
  meeting_link: string | null
}

export interface IWeeklyNorm {
  id: string
  start_date: string
  end_date: string
  max_shift: number
}
