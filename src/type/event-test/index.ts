export interface IEventTest {
  id: string
  name: string
  status: string
  required_percent_score: number
  minimum_score: number
  is_limited: boolean
  limit_count: number
  quiz_timed: number
  started_at: Date
  finished_at: Date
  course_category_id: string
  event_id: string
  attempts: Array<any>
  quiz_question_instances: Array<any>
  is_opened: boolean
  is_attempt: boolean
  attempt_status: string
  total_correct_answer: number
  total_attempt_time: number
  total_question: number
  course_category: {
    name: string
  }
  spend_time: number
}
