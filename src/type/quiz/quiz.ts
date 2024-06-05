import { IMeta } from '../courses'

export interface IScoreDetails {
  meta: IMeta
  answers: IAnswer[]
}

export interface IAnswer {
  id: string
  quiz_attempt_id: string
  question_id: string
  is_correct: boolean
  time_spent: number
  active: boolean | null
  topic_attempt_id: string | null
  question: Question
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
  question_filter_id: QuestionFilter
  question_content: string
  level: string
  qType: string
  question_report: QuestionReport
}
