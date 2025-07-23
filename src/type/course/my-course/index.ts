import { Metadata } from 'src/type/results'
import { CourseProgram } from '..'
import { ExaminationSubject } from '@components/profile/ExamInformation/type'
import { ISubSection } from 'src/type/courses-3-level'

export * from './Result'

export interface CourseDetail {
  metadata: Metadata
  class_user_id: string
  code: string
  is_passed: boolean
  passed_at: string
  user_certificate_id: string
  user_certificate_url: string
  remind_choosing_exam: RemindChoosingExam
  exam: ExaminationSubject | null
  data: Data
  class_type: string
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
  activity_count?: number
  subsections: ISubSection[]
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
