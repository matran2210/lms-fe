import { GRADE_STATUS } from "../../constants"
import { GradingMethod } from "../../enums"
import { IMetaData } from "../api-response"


export interface IResultsList {
  metadata: IMetaData
  data: Results[]
  class_user_id: string
}
export interface Results {
  id: string
  name: string
  course_section_type: string
  quiz: QuizResult
  quiz_activity: QuizActivity[]
  path: any
  class_user_id: string
}

export interface QuizActivity {
  required_percent_score: number
  name: string
  quiz_timed: number
  quiz_type: string
  id: string
  grading_method: GradingMethod
  is_graded: boolean
  attempts: Attempt[]
  quiz_path?: string
  activity_id?: string
}

export interface QuizResult {
  id: string;
  name: string;
  is_graded: boolean;
  grading_method: GradingMethod;
  required_percent_score: number;
  quiz_timed: any;
  quiz_question_type: string;
  quiz_type: string;
  attempts: Attempt[];
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
  grading_status: (typeof GRADE_STATUS)[keyof typeof GRADE_STATUS] | null
  started_at: string
  finished_at: string
}

export interface IAtempt {
  id: string
  quiz_position_mapping: any[]
  class_user_id: string
  quiz: {
    id: string
    quiz_type:
      | 'MID_TERM_TEST'
      | 'FINAL_TEST'
      | 'MOCK_TEST'
      | 'TOPIC_TEST'
      | 'CHAPTER_TEST'
      | 'ENTRANCE_TEST'
  }
}
export interface ITestQuizProps {
  resultData: Results[]
  handleViewResult: (row: Results) => void
  getNameTooltipContent?: (row: Results) => React.ReactNode
  getScore?: (row: Results, grading_method: GradingMethod) => string
  lastElementRef: (node: HTMLDivElement) => void
}
