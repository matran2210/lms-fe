import { QUESTION_TYPES } from 'src/constants'
import { IMeta } from '../courses'
import { IMetaData } from '..'

export interface IScoreDetails {
  metadata: IMeta
  answers: IAnswer[]
  activity_info: ActivityInfo
}

export interface ActivityInfo {
  activity_id: string
  class_id: string
  class_user_id: string
}

export interface IAnswer {
  id: string
  quiz_attempt_id: string
  question_id: string
  answer_file: any
  is_correct: boolean
  time_spent: number
  active: any
  topic_attempt_id: any
  requirement_id: any
  question: Question
  index: number
  belong_to: BelongTo
}

interface BelongTo {
  id: string
  name: string
}

interface QuestionFilter {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  context: string | null
  course_id: string
  part_id: string
  chapter_id: string | null
  unit_id: string | null
  activity_id: string | null
  quiz_id: string | null
  part: {
    id: string
    name: string
    short_name: string
  }
  chapter: {
    id: string
    name: string
    short_name: string
  }
}

interface QuestionReport {
  ratio: number
  average_time: number
}

interface Question {
  id: string
  question_filter: QuestionFilter
  question_content: string
  level: string
  qType: QUESTION_TYPES
  question_report: QuestionReport
}

export interface IQuizResult {
  finished_at: Date
  id: string
  is_graded: boolean
  ratio_score: string
  score: number
  total_attempt_time: number
  name: string
  status: string
  quiz: {
    id: string
    is_graded: boolean
    required_percent_score: number
    is_limited: boolean
    limit_count?: number
    grading_method?: string
  }
}

export interface IQuizResultList {
  metadata: IMetaData
  data: IQuizResult[]
}
