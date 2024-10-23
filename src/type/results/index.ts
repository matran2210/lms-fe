// export interface IResultsList {
//     success: boolean
//     data: Data
//   }

import { GradingMethod, GradingStatus } from '@utils/constants'

export interface IResultsList {
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
  name: string
  course_section_type: string
  quiz: Quiz
  path: any
}

export interface Quiz {
  id: string
  name: string
  is_graded: boolean
  grading_method: GradingMethod
  required_percent_score: number
  quiz_timed: any
  quiz_question_type: string
  quiz_type: string
  attempts: Attempt[]
}

export interface Attempt {
  id: string
  updated_at: string
  total_attempt_time: number
  is_graded: boolean
  score: number
  ratio_score: string
  multiple_choice_score: number
  constructed_score: number
  status: string
  grading_status: GradingStatus | null
  started_at: string
  finished_at: string
}
