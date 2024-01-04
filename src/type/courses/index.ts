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
    quiz_timed: number
    quiz_type: string
    is_limited: boolean
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
  CANCELED = 'ENDED', // 4
}

export interface IClassUserInstances {
  extend_count: number
  id: string
  is_passed: boolean
  learning_progress: {
    total_course_sections: number
    total_course_sections_completed: number
  }
  status: string
  type: string
  updated_at: Date
  started_at: Date
  finished_at: Date
}

export interface IClasses {
  code: string
  duration_type: 'FLEXIBLE' | 'FIXED'
  finished_at: Date | null
  id: string
  name: string
  status: string
  type: string
  updated_at: Date | null
  class_user_instances: IClassUserInstances[]
  course_type: string
}

export interface ICourse {
  certificate_id: string
  classes: IClasses[]
  code: string
  type: string
  description: string
  id: string
  status: string
  updated_at: Date
  name: string
  course_type: string
}
export interface ICourseAll {
  courses: ICourse[]
  metadata: IMeta
  status: Array<{ count: number; status: string }>
  total: Array<{ categoryName: string; count: number }>
}

export interface IResource {
  created_at: Date
  file_key: string
  id: string
  is_default: boolean
  location: string
  name: string
  resource_type: string
  size: number
  status: string
  suffix_type: string
  thumbnail: string
  updated_at: string
}
export interface IResourceDetail {
  meta: IMeta
  resources: IResource[]
}

export interface ISection {
  course_id: string
  course_section_type: string
  created_at: Date
  id: string
  name: string
  updated_at: Date
}

export interface ISectionDetail {
  meta: IMeta
  sections: ISection[]
}
