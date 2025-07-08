export interface IEntranceTest {
  id: string
  name: string
  status: string
  required_percent_score: number
  minimum_score: number
  is_limited: boolean
  limit_count: number
  quiz_timed: number
  course_category_id: string
  subject_id: string
  attempts: Attempt[]
  is_attempt: boolean
  total_question: number
  created_at: string
  attempt_times: number
  total_attempt_time?: number
  attempt_status: string
  quiz_attempt_id: string
  score?: number
  total_correct_answer: number
}

export interface Attempt {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  user_id: string
  quiz_id: string
  description: any
  total_attempt_time?: number
  is_graded: boolean
  score?: number
  major_score: any
  english_score?: number
  ratio_score: string
  multiple_choice_score?: number
  constructed_score?: number
  feed_back: any
  status: string
  grading_status: any
  feedback_user_id: any
  quiz_position_mapping?: QuizPositionMapping[]
  class_user_id: any
  number_of_attempts: number
  started_at: string
  finished_at?: string
  major_classification?: string
  english_classification?: string
  answers: Answer[]
}

export interface QuizPositionMapping {
  question_id: string
}

export interface Answer {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  quiz_attempt_id: string
  question_id: string
  question_answer_id?: string
  teacher_id: any
  feed_back: any
  short_answer: any
  answer_file: any
  answer: any
  response_option: any
  scratch_pad?: string
  is_correct: boolean
  status: any
  flag: boolean
  time_spent: number
  active: any
  topic_attempt_id: any
  requirement_id?: string
  is_viewed_answer: boolean
}
