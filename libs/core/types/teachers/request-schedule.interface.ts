import { StatusRequestSchedule } from "../../enums";
import { ClassStandardScheduleItem, ICourseCategory } from "../classes";

export interface RequestScheduleParams {
  page_index: number;
  page_size: number;
  fromDate?: string;
  toDate?: string;
  dateField?: string;
  search?: string;
  course_category_id?: string;
  status?: string;
}
export interface StatusRequestScheduleParams {
  reason?: string;
  status: StatusRequestSchedule;
}

export interface FilterRequestScheduleParams {
  fromDate?: string;
  toDate?: string;
  dateField?: string;
  search?: string;
  course_category_id?: string;
  status?: string;
  tab?: string;
}

export interface IScheduleCourseSection {
  id: string;
  name: string;
  short_name: string;
}
export interface IScheduleRequestItem {
  id: string;
  created_at: string;
  updated_at: string;
  type: string;
  status: StatusRequestSchedule;
  description?: string;
  due_date: string;
  mode: string;
  name: string;
  teacher_schedule_id: string;
  class: ClassInfo;
  subject: SubjectInfo;
  schedule_time: ScheduleTime;
  staff_detail: StaffDetail;
  course_section: IScheduleCourseSection;
}

export interface ClassInfo {
  id: string;
  code: string;
  instruction_mode: string;
  class_standard_schedules: ClassStandardScheduleItem[];
  link_meeting: string;
}
export interface RoomInfo {
  id: string;
  code: string;
  name: string;
  address: string;
}

export interface SubjectInfo {
  id: string;
  course_category_id: string;
  name: string;
  code: string;
  course_category: ICourseCategory;
}

export interface ScheduleTime {
  start_date?: string;
  end_date?: string;
}

export interface StaffDetail {
  id: string;
  full_name: string;
}

export interface ScheduleRequestDetail {
  id: string;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  mode: string;
  description: string | null;
  due_date: string;
  name: string;
  teacher_schedule_id: string;
  room: RoomInfo;
  class: ClassInfo;
  subject: SubjectInfo;
  schedules: ScheduleTimeItem[];
  staff_detail: StaffDetail;
}

export interface ScheduleTimeItem {
  id: string;
  start_date: string | null;
  end_date: string | null;
  start_time: string;
  end_time: string;
}

export interface APIListScheduleRequestResponse {
  success: boolean;
  data: ResponseData;
}
export interface ResponseData {
  data: IScheduleRequestItem[];
  meta: Meta;
}
export interface Meta {
  total_pages: number;
  total_records: number;
  page_index: number;
  page_size: number;
}

export interface APIDetailScheduleRequestResponse {
  success: boolean;
  data: ScheduleRequestDetail;
}
