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
  name: string
  quiz: {
    attempts: Array<any>
    id: string
    limit_count: number
    name: string
    quiz_timed: boolean
    quiz_type: string
  }
  learning_progress: {
    total_course_sections: number
    total_course_sections_completed: number
  }
  remaining_time: number
  description: string
}

export interface ICourseDetail {
  certificate_id: string
  code: string
  id: string
  name: string
  status: string
  course_sections_with_progress: ICourseSection[]
}

export interface IMeta {
  page_index: number
  page_size: number
  total_pages: number
  total_records: number
}

export interface ICourseDetailAll {
  data: ICourseDetail
  metadata: IMeta
}

export enum CLASS_USER_STATUS {
  READY_TO_LEARN = 'READY_TO_LEARN', // 1
  IN_PROGRESS = 'IN_PROGRESS', // 2
  COMPLETED = 'COMPLETED', // 3
  CANCELED = 'CANCELED' // 4 
}
