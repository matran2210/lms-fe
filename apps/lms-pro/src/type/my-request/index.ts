import { E_REQUEST_STATUS, REPEAT_TYPE } from '@lms/core'
import { Dayjs } from 'dayjs'
import { REQUEST_STATUS } from '@lms/core'

export type RecurringScheduleType = keyof Omit<
  typeof REPEAT_TYPE,
  'DOES_NOT_REPEAT' | 'FORMAT'
>
export interface IRequest {
  request_name: string
  request_type: { value: string; label: string }
  request_type_value: string
  request_status_value: string
  request_teacher_id: string
  request_create_date: string
  request_creator: string
  request_approver: string
  class: { value: string; label: string }
  class_code?: string
  request_status?: { value: string; label: string }
  request_busy_schedule?: IBusySchedule[]
  request_weekly_norm?: IWeeklyNorm[]
  request_time_off?: ITimeOff[]
  note?: string
}
export interface ITimeOff {
  lessonId: string
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
  name: string
  is_holiday: boolean
  description: string
  recurring_pattern_id: string | null
  recurring_pattern_schedule: IRecurringSchedule
  class_schedule: { id: string; class: { id: string; code: string } }
}
interface ITeacher {
  id: string
  detail: {
    full_name: string
  }
}
export interface IRecurringSchedule {
  interval?: number
  frequency?: string
  recurrence_end_date?: Date | string
  day_of_week?: number[]
  day_of_month?: number[]
  month_of_year?: number[]
  start_date?: string
  end_date?: string
  type?: REPEAT_TYPE
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
  status: E_REQUEST_STATUS
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
  staff_assignee: { id: string; detail: { full_name: string } }
  description: string
  due_date: string | null
  name: string
  teacher_schedules: ITeacherSchedules[]
  teacher_weekly_norms: IWeeklyNorms[] // Empty array in the example, but may contain data in other responses
}
export interface IBusySchedule {
  date_range?: [Date, Date]
  start_time?: Dayjs | string
  end_time?: Dayjs | string
  repeat_schedule: {
    repeat: boolean
    recurring_schedule: IRecurringSchedule
  }
  description?: string
  repeat?: REPEAT_TYPE
  'drawer-repeat-interval'?: string
  'drawer-repeat-frequency'?: string
  'drawer-repeat-day'?: string[]
  'drawer-repeat-end-on'?: Date
  T2?: string
  T3?: string
  T4?: string
  T5?: string
  T6?: string
  T7?: string
  CN?: string
}

export interface IWeeklyNorm {
  date_range?: Date[] | string[]
  start_time?: Dayjs | string
  end_time?: Dayjs | string
  quantity: number | undefined
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

export interface IBusyScheduleBase {
  event_name: string
  repeat: boolean
  range: {
    start_time: string | Date
    end_time: string | Date
  }
  recurring_schedule?: IRecurringSchedule
  description: string
}

export interface ICreateBusyScheduleData extends IBusyScheduleBase {}

export interface IEditBusyScheduleData extends Partial<IBusyScheduleBase> {
  status?: string
}

export interface IWeeklyNormBase {
  request_name?: string
  request_type?: string
  time?: IWeeklyNorm[]
  note?: string | null
}
export interface ICreateWeeklyNormData
  extends Omit<IWeeklyNormBase, 'request_name' | 'request_type'> {
  request_name: string
  request_type: string
}
export interface IEditWeeklyNormData extends IWeeklyNormBase {
  status?: string
}

interface ITimeoffRequestBase {
  request_name?: string
  status?: string
  scheduleAdjustments?: { id: string; reason: string }[]
}

export interface ICreateTimeoffRequestData
  extends Omit<ITimeoffRequestBase, 'request_name'> {
  request_name: string
  teacher_id: string
}

export interface IEditTimeoffRequestData extends ITimeoffRequestBase {}

interface IStaffAssignee {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  key: string
  username: string
  password: string
  nick_name: string | null
  status: string
  detail_id: string
  department_id: string | null
  course_category_id: string
}

export interface ICreateEditWeeklyNorm {
  type: string
  status: string
  user_request_id: string
  name: string
  staff_assignee: IStaffAssignee
  staff_request_id: string | null
  description: string
  due_date: string
  staff_assignee_id: string
  deleted_at: string | null
  user_assignee_id: string | null
  id: string
  created_at: string
  updated_at: string
}
