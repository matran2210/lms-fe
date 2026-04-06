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
  next_section: {
    is_preview_locked: boolean
  }
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
    attempt_count: number
  }
  learning_progress: {
    total_course_sections: number
    total_course_sections_completed: number
  }
  remaining_time: number
  description: string
  user_section_learning_status: string
}

export interface IAttempts {
  constructed_score: number
  id: string
  is_graded: boolean
  multiple_choice_score: number
  ratio_score: string
  score: number
  status: string
  total_attempt_time: number
  updated_at: Date
}
export interface ICourseDetail {
  certificate_id: string
  code: string
  id: string
  name: string
  status: string
  course_sections_with_progress: ICourseSection[]
  course_section_type: string
  description: string
  duration: number | null
  learning_progress: {
    total_course_sections: number
    total_course_sections_completed: 1
  }
  position: number | null
  user_section_learning_status: string
  quiz: {
    attempt_count: number
    id: string
    is_graded: boolean
    is_limited: boolean
    limit_count: number
    name: number
    quiz_report: {
      average_time: number
      ratio: number
    }
    quiz_timed: number | null
    quiz_type: string
    required_percent_score: number
    attempts: IAttempts[]
  }
  remaining_time: number
}

export interface IMeta {
  page_index: number
  page_size: number
  total_pages: number
  total_records: number
}

export interface ICourseDetailAll {
  class_user_id?: string
  data: ICourseDetail
  metadata: IMeta
}

export enum CLASS_USER_STATUS {
  READY_TO_LEARN = 'READY_TO_LEARN', // 1
  IN_PROGRESS = 'IN_PROGRESS', // 2
  COMPLETED = 'COMPLETED', // 3
  CANCELED = 'CANCELED', // 4
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
  is_opened: boolean
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
  flexible_days: number
  normal_class_connections: {
    foundation_class_id: string
    id: string
  }[]
}

export interface ICategory {
  id: string
  name: string | null
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
  course_categories: ICategory[]
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
  parent_id: string
  name: string
  updated_at: Date
}

export interface ISectionDetail {
  meta: IMeta
  sections: ISection[]
}

export interface IQuizSetting {
  id: string
  start_time: any
  end_time: any
  quiz_id: string
  allow_attempt: boolean
  reason_for_reject: 'EXPIRED' | 'NOT_OPEN_YET'
}

export interface IMyCourseDetail {
  course_section_type: string
  description: string
  duration: number
  id: string
  name: string
  position: number
  learning_progress: {
    duration: number
    time_spent: number
    total_course_sections: number
    total_course_sections_completed: number
  }
  quiz: {
    quiz_setting: IQuizSetting
    attempt: {
      grading_method?: string
      id: string
      number_of_attempts: number
      ratio_score: string
      total_attempt_time: number
      grading_status?: string
      status?: string
      created_at?: Date
      score?: string | number
    }
    id: string
    is_graded: boolean
    is_limited: boolean
    limit_count: number
    quiz_timed: number
    required_percent_score: number
    grading_method?: string
  }
  user_section_learning_status: string
  course_section_link_parents?: [
    {
      course_section_id: string
      id: string
      is_preview_locked: boolean
      position: number
      is_showing_locked: boolean
    },
  ]
  cta_status?: 'BEGIN' | 'PREVIEW'
}

export enum QuizAttemptChartType {
  ENTRANCE_TEST = 'ENTRANCE_TEST',
  CFA = 'CFA',
  ACCA = 'ACCA',
  CMA = 'CMA',
  OTHER = 'OTHER',
}

export type IQuizAttemptChartType =
  | 'ENTRANCE_TEST'
  | 'CFA'
  | 'ACCA'
  | 'CMA'
  | 'OTHER'

export type SectionDropdownFormValues = {
  section: string | null
  subsection: string | null
  unit: string | null
  activity: string | null
}

export const allTypes = ['section', 'subsection', 'unit', 'activity'] as const

export type SectionField = (typeof allTypes)[number]

export interface IOpenChooseItem {
  isOpen: boolean
  type: SectionField
  name: string
  params?: string
}

export const nextTypeMap = {
  section: 'subsection',
  subsection: 'unit',
  unit: 'activity',
} as Record<SectionField, SectionField>

export const backTypeMap = {
  activity: 'unit',
  unit: 'subsection',
  subsection: 'section',
} as Record<SectionField, SectionField>

export const getTypeName = {
  section: 'Section',
  subsection: 'Subsection',
  unit: 'Unit',
  activity: 'Activity',
} as Record<SectionField, string>

export interface ISelectOption {
  label: string
  value: string
  name?: string
}

export * from './test'
