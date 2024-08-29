import { QUESTION_TYPES } from 'src/constants'
import { IMeta } from '../courses'

export interface IScoreDetails {
  meta: IMeta
  answers: IAnswer[]
  answer_groups?: IAnswearGroup[]
}

export interface IAnswearGroup {
  answers?: IAnswer[]
  id?: string
  name?: string
}
export interface IAnswer {
  id: string
  quiz_attempt_id: string
  question_id: string
  is_correct: boolean
  time_spent: number
  active: string
  topic_attempt_id: string | null
  question: Question
  index: number
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
