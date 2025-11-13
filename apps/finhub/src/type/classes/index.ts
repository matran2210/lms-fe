import { QUIZ_ATTEMPT_GRADING_STATUS, QUIZ_ATTEMPT_STATUS } from 'src/constants'
import { Metadata } from '../results'

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
  meta: Metadata
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
  meta: Metadata
  success?: boolean
}
