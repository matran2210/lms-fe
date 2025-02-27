export interface UserExamInformation {
  success: boolean
  data: Data
}

export interface Data {
  data: Data2
}

export interface Data2 {
  metadata: Metadata
  data: Daum[]
}

export interface Metadata {
  total_pages: number
  total_records: number
  page_index: number
  page_size: number
}

export interface Daum {
  id: string
  started_at: string
  finished_at: string
  user_id: string
  examination_subject_id: string
  is_final_examination_subject: boolean
  defer_examination_reason: any
  class: Class
  examination_subject: ExaminationSubject
}

export interface Class {
  id: string
  code: string
  course: Course
}

export interface Course {
  id: string
  name: string
  course_categories: CourseCategory[]
  subject: Subject
}

export interface CourseCategory {
  id: string
  name: string
}

export interface Subject {
  id: string
  name: string
  code: string
}

export interface ExaminationSubject {
  id: string
  code_exam: string
  start_date: any
  end_date: string
  examination: Examination
}

export interface Examination {
  id: string
  name: string
}
