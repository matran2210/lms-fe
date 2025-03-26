import { Dayjs } from 'dayjs'

export interface IRequest {
  request_name: string
  request_type: { value: string; label: string }
  request_type_value: string
  request_teacher_id: string
  class: { value: string; label: string }
  class_code?: string
  request_status?: string
  request_busy_schedule?: IBusySchedule[]
  request_weekly_norm?: IWeeklyNorm[]
  request_time_off?: ITimeOff[]
  note?: string
}
export interface ITimeOff {
  lesson: string
  reason: string
}
interface ISchedule {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  is_holiday: boolean
  description: string
  recurring_pattern_id: string | null
}
interface ITeacher {
  id: string
  detail: {
    full_name: string
  }
}

export interface ITeacherSchedules {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  description: string
  user_id: string
  schedule_id: string
  teacher: ITeacher
  is_active: boolean
  before_active_id: string | null
  request_id: string
  user: ITeacher
  request_reason: string
  schedule: ISchedule
}
export interface IWeeklyNorms {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  max_shift: number
  schedule_id: string
  teacher: ITeacher
  is_active: boolean
  start_date: string | Date | Dayjs
  end_date: string | Date | Dayjs
  before_active_id: string | null
  request_id: string
}
export interface IBusyRequestDetailResponse {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  type: string
  status: string
  user_request: {
    id: string
    username: string
    nickname: string | null
    detail: { full_name: string }
  }
  user_request_id: string | null
  staff_request: { id: string; detail: { full_name: string } }
  staff_request_id: string
  staff_assignee_id: string
  description: string
  due_date: string | null
  name: string
  teacher_schedules: ITeacherSchedules[]
  teacher_weekly_norms: IWeeklyNorms[] // Empty array in the example, but may contain data in other responses
}
export interface IBusySchedule {
  date_range?: Date[] | string[]
  start_time?: Dayjs | string
  end_time?: Dayjs | string
  description: string
}

export interface IWeeklyNorm {
  date_range?: Date[] | string[]
  start_time?: Dayjs | string
  end_time?: Dayjs | string
  quantity: number
}
export interface ITimeoffRequestDetailResponse {
  request_name: string
  request_type: string
  teacher_name: string
  status: string
  description: string
  courses: any[]
  class_code: string
}
