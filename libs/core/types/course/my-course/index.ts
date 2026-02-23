import { CourseProgram } from '..'
import { IMetaData } from '../../api-response'
import { ExaminationSubject } from '../../exam-infomation'

export * from './Result'
export * from "./Activity"
export interface CourseDetail {
  metadata: IMetaData
  class_user_id: string
  code: string
  is_passed: boolean
  passed_at: string
  user_certificate_id: string
  user_certificate_url: string
  certificate?: CourseCertificate | null
  remind_choosing_exam: RemindChoosingExam
  exam: ExaminationSubject | null
  data: Data
  class_type: string
}

export interface CourseCertificate {
  id: string
  html_template: string
  name: string
}

export interface RemindChoosingExam {
  remaining_changes: number
  remind_by_progress: boolean
  remind_by_duration: boolean
}

interface Data {
  id: string
  course_sections_with_progress: CourseSectionsWithProgress[]
  name: string
  program: CourseProgram
  course_type: string
}

export interface CourseSectionsWithProgress {
  id: string
  name: string
  description?: string
  duration: string
  course_section_type: string
  cta_status: string
  quiz?: Quiz
  course_section_link_parents: CourseSectionLinkParent[]
  learning_progress: LearningProgress
  position: number
  user_section_learning_status: string
}

export interface Quiz {
  id: string
  is_graded: boolean
  grading_method: string
  required_percent_score: number
  is_limited: boolean
  limit_count: number
  quiz_timed: string
  attempt: number
  quiz_setting: unknown
}

export interface CourseSectionLinkParent {
  id: string
  course_section_id: string
  position: number
  is_preview_locked: boolean
  is_showing_locked: boolean
}

export interface LearningProgress {
  total_course_sections: number
  total_course_sections_completed: number
  time_spent: number
  duration: number
}
