import { Metadata } from '../results'

export enum QUIZ_TYPE {
  QUIZ = 'QUIZ',
  MID_TERM_TEST = 'MID_TERM_TEST',
  FINAL_TEST = 'FINAL_TEST',
  MOCK_TEST = 'MOCK_TEST',
  // ENTRANCE_TEST = 'ENTRANCE_TEST',
  STORY = 'STORY',
  TOPIC_TEST = 'TOPIC_TEST',
  CHAPTER_TEST = 'CHAPTER_TEST',
}
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
  course?: {
    name: string
  }
  status?: string
  facility?: {
    address?: string
  }
  started_at?: string
  finished_at?: string
  progress?: number
}
export interface IStudentClassDetail {
  user?: {
    id?: string
    hubspot_contact_id?: string
    detail?: {
      full_name?: string
      level?: string
    }
    user_contacts?: {
      email?: string
      phone?: string
    }[]
  }
  started_at?: string
  updated_at?: string
  examination_subject?: string
  learning_progress?: {
    total_course_sections_completed?: number
    total_course_sections?: number
  }
}
export interface IStudentTestResult {
  quiz?: {
    id?: string
    name?: string
    quiz_type?: string
  }
  mode?: string
  grading_method?: string
  start_time?: string
  total_attempts?: number
  total_grading_attempts?: number
  end_time?: string
}
export interface IMyClass {
  id: string
  name: string
  code: string
  status: string
  description: string
  progress?: number
  course_type?: string
  course: {
    name: string
  }
  classes: {
    id: string
    status: string
    type: string
    duration_type?: string
    flexible_days?: number
    finished_at?: string
    class_user_instances: {
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
    }[]
  }[]
}
export interface ICourseSubject {
  id: string
  name: string
  code?: string
  course_category?: {
    name: string
  }
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
  course_category: {
    name: string
    id: string
  }
}
export interface ISubjectList {
  subjects: ISubject[]
  meta: Metadata
  success?: boolean
}
