export interface ExamInformation {
  success: boolean
  data: Data
}

export interface Data {
  course: Course
  program: Program
  subject: Subject
  exam: Exam
  is_final_examination_subject: boolean
  remaining_changes: number
  revision_class: {
    id: string
    name: string
    code: string
  }
}

export interface Course {
  id: string
  name: string
  subject_id: string
  status: string
  course_type: string
  course_categories: CourseCategory[]
}

export interface CourseCategory {
  id: string
  name: string
}

export interface Program {
  id: string
  name: string
}

export interface Subject {
  id: string
  name: string
  code: string
}

export interface Exam {
  id: string
  code_exam: string
  start_date: string
  end_date: string
  examination: Examination
}

export interface Examination {
  id: string
  name: string
}
