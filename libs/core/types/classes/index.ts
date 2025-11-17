import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from "../../enums"
import { IMetaData } from "../api-response"

export interface IUniversityProgram {
  value: string
  label: string
}

export interface ICertificateData {
  label: string
  value: string | number | null
  isTag?: boolean
  color?: string
}

export interface IClassCard {
  course?: { name: string }
  status?: string
  facility?: { address?: string }
  started_at?: string
  finished_at?: string
  progress?: number
}

export interface IUserContact {
  email?: string
  phone?: string
}

export interface IUserDetail {
  full_name?: string
  level?: string
}

export interface IUser {
  id?: string
  hubspot_contact_id?: string
  detail?: IUserDetail
  user_contacts?: IUserContact[]
}

export interface IStudentClassDetail {
  user?: IUser
  flexible_duration?: number
  finished_at?: string
  is_passed?: boolean
  attempt?: {
    finished_at?: string
    status?: QUIZ_ATTEMPT_STATUS
    score?: number
    grading_status?: QUIZ_ATTEMPT_GRADING_STATUS
  }
  start_time?: string
  end_time?: string
  started_at?: string
  updated_at?: string
  examination_subject?: {
    examination?: {
      name?: string
    }
  }
  learning_progress?: {
    total_course_sections_completed?: number
    total_course_sections?: number
  }
  staff?: {
    detail: {
      full_name?: string
    }
  }
}

export interface IStudentTestResult {
  quiz?: {
    id?: string
    name?: string
    quiz_type?: string
    grading_method?: string
    due_date_grade?: string
  }
  mode?: string
  start_time?: string
  total_attempts?: number
  total_grading_attempts?: number
  end_time?: string
}

export interface IClassUserInstance {
  id: string
  type: string
  status: string
  started_at?: string
  finished_at?: string
  is_passed?: boolean
  is_opened?: boolean
  extend_count?: number
  learning_progress?: {
    total_course_sections_completed: number
    total_course_sections: number
  }
}

export interface IClass {
  id: string
  status: string
  type: string
  duration_type?: string
  flexible_days?: number
  finished_at?: string
  class_user_instances: IClassUserInstance[]
}
export interface ClassStandardScheduleItem {
  day_of_week: number;
  start_time: string;
  end_time: string;
}
export interface IMyClass {
  id: string
  name: string
  code: string
  status: string
  description: string
  progress?: number
  course_type?: string
  course: { name: string }
  classes: IClass[]
  started_at: Date
  finished_at: Date
  class_standard_schedules?: ClassStandardScheduleItem[]
  duration_type?: string
  flexible_days?: number
}

export interface ICourseCategory {
  name: string
  id: string
}

export interface ICourseSubject {
  id: string
  name: string
  code?: string
  course_category?: ICourseCategory
  course_category_id: string
  created_at?: Date
  updated_at?: Date
}

export interface ICourseSubjectList {
  meta: IMetaData
  subjects: ICourseSubject[]
}

export interface ISubject {
  id: string
  course_category_id: string
  name: string
  code: string
  course_category: ICourseCategory
}

export interface ISubjectList {
  subjects: ISubject[]
  meta: IMetaData
  success?: boolean
}
