import { Dayjs } from 'dayjs'
import { IMetaData, IUser } from '.'
import { ISelect } from './course'
import { REQUEST_STATUS, REQUEST_TYPE } from '../constants'
import { E_REQUEST_TYPE } from '../enums'

export type RequestType = keyof typeof REQUEST_TYPE

export type RequestStatus = keyof typeof REQUEST_STATUS

export interface IRequestList {
  meta_data: IMetaData
  results: IRequest[]
}

export interface IRequest {
  id: string
  name: string
  type: E_REQUEST_TYPE
  status: RequestStatus
  teacher_schedules: ITeacherSchedule[]
  teacher_weekly_norms: ITeacherWeeklyNorm[]
  user_request: Partial<IUser>
  staff_assignee?: string
  staff_request?: Partial<IUser>
  creator: Partial<IUser> // staff_request || user_request
  time?: ITeacherSchedule[] | ITeacherWeeklyNorm[]
  created_at: string[]
  updated_at: string
  description: string
  repeat: boolean
  reason?: ITeacherSchedule[]
  note?: string
  customName?: React.ReactNode
}

export interface ITeacherSchedule {
  id: string
  request_reason?: string
  schedule: ISchedule
}

export interface ISchedule {
  id: string
  name?: string
  start_date: string
  end_date: string
  start_time: string
  end_time: string
  class_schedule: IClassSchedule
  description: string
}

export interface IClassSchedule {
  id: string
  class: ISimpleClass
}

export interface ISimpleClass {
  id: string;
  code: string;
}

export interface ITeacherWeeklyNorm {
  id: string
  start_date: string
  end_date: string
  max_shift: number
}

export interface IRequestFilterForm {
  request_name: string
  type: ISelect
  status: ISelect
  rangeDate: [Dayjs, Dayjs]
}

export function isTeacherSchedule(
  item: ITeacherSchedule | ITeacherWeeklyNorm,
): item is ITeacherSchedule {
  return 'schedule' in item
}

export function isTeacherWeeklyNorm(
  item: ITeacherSchedule | ITeacherWeeklyNorm,
): item is ITeacherWeeklyNorm {
  return 'max_shift' in item
}
