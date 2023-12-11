export interface ICourseOutcome {
  created_at: Date
  deleted_at: Date
  description: string
  id: string
  updated_at: Date
}

export interface ILearningOutcome {
  created_at: Date
  deleted_at: Date
  description: string
  id: string
  name: string
  updated_at: Date
  course_outcomes: ICourseOutcome[]
}

export interface ICourseSection {
  course_section_type: string
  id: string
  quiz: null
  learning_progress: {
    total_course_sections: number
    total_course_sections_completed: number
  }
}

export interface ICourseDetail {
  certificate_id: string
  code: string
  id: string
  name: string
  status: string
  course_sections_with_progress: ICourseSection[]
}
