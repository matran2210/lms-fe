export interface QuizReport {
  ratio: number
  average_time: number
}

export interface ChartDatum {
  part_id: string
  total_questions: number
  total_correct_answers: number
  title: string
  total_quiz_questions: number
  short_name: string
}

export interface Quiz {
  id: string
  quiz_type: string
  is_graded: boolean
  required_percent_score: number
  course_category_id: string
  subject_id: string
}

export interface QuizAttemptChart {
  is_publish_detail: boolean
  learning_program: string
  quiz_report: QuizReport
  remark: any[]
  total_question: number
  correct_answer: number
  chart_type: string
  chart_data: ChartDatum[]
  quiz: Quiz
  multiple_choice_score: number
}
