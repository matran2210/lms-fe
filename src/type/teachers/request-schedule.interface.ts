import { StatusRequestSchedule } from '@utils/constants/Teacher'

export interface RequestScheduleParams {
  page_index: number
  page_size: number
  fromDate?: string
  toDate?: string
  dateField?: string
  search?: string
  course_category_id?: string
  status?: string
}
export interface StatusRequestScheduleParams {
  reason?: string
  status: StatusRequestSchedule
}

export interface FilterRequestScheduleParams {
  fromDate?: string
  toDate?: string
  dateField?: string
  search?: string
  course_category_id?: string
  status?: string
}

export interface IScheduleRequestItem {
  id: string
  created_at: string
  updated_at: string
  type: string
  status: StatusRequestSchedule
  description?: string
  due_date: string
  name: string
  teacher_schedule_id: string
  class: ClassInfo
  subject: SubjectInfo
  schedule_time: ScheduleTime
  staff_detail: StaffDetail
}

export interface ClassInfo {
  id: string
  code: string
}

export interface SubjectInfo {
  id: string
  course_category_id: string
  name: string
  code: string
  course_category: CourseCategory
}

export interface CourseCategory {
  id: string
  name: string
}

export interface ScheduleTime {
  start_date?: string
  end_date?: string
}

export interface StaffDetail {
  id: string
  full_name: string
}
