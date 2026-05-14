import { IMetaData } from "../api-response";

export interface IAttendanceStatistics {
  total: number;
  attended: number;
  absent: number;
  attendance_rate: number;
}

export interface IStudentAttendanceListParams {
  page_index: number;
  page_size: number;
  fromDate?: string;
  toDate?: string;
  lesson_ids?: string[];
  status?: string;
}
export interface ILessonListParams {
  page_index: number;
  page_size: number;
  fromDate?: string | undefined;
  toDate?: string | undefined;
  class_ids?: string[] | undefined;
  search?: string | undefined;
}

export interface IStudentAttendanceListResponse {
  metadata: IMetaData;
  attendances: IStudentAttendanceItem[];
}
export interface IStudentLessonListResponse {
  metadata: IMetaData;
  data: IClassScheduleUserItem[];
}
export interface IClassAttendanceHistoryResponse {
  checkin_time: string;
  checkout_time: string;
  device: string;
}
export interface IStudentAttendanceItem {
  class_schedule_user_id: string;
  schedule_id: string;
  lesson: string;
  lesson_date: ILessonDate;
  checkin_time: string;
  checkout_time: string;
  status: string;
}

export interface ILessonDate {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

export interface IClassScheduleUserItem {
  class_schedule_user: IClassScheduleUser;
}

export interface IClassScheduleUser {
  schedule_id: string;
  schedule_name: string;
  class_schedule_user_id: string;
}
