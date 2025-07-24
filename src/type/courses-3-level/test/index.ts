import { IAnswer, IScoreDetails } from 'src/type/quiz'
import { InfiniteData } from 'react-query'
import { IFile } from '../../course'

export interface ChartDatum {
  part_id: string
  total_questions: number
  total_correct_answers: number
  title: string
  total_quiz_questions: number
  section_score: number
  max_section_score: number
  short_name: string
}

export interface IQuizAttempComment {
  comment: string
  created_at: Date
  id: string
  recommendation: string
}

export interface IProps {
  data: ChartDatum[]
  GlobalAverage?: number
  score?: number
  isGraded?: boolean
  passingScore?: number
  recommendation?: IQuizAttempComment[]
}

export type IQuizAttemptChartType =
  | 'ENTRANCE_TEST'
  | 'CFA'
  | 'ACCA'
  | 'CMA'
  | 'OTHER'

export interface ScoreDetailProps {
  className?: string
  yourScoreDetailRef?: React.RefObject<HTMLDivElement>
  type: IQuizAttemptChartType
  gradingStatus?: string
  scoreDetails?: InfiniteData<IScoreDetails | undefined>
  fetchNextPage?: () => void
  hasNextPage?: boolean
  isLoading?: boolean
  isFetchingNextPage?: boolean
}

export interface MultipleQuestionsData {
  quizAttempt?: {
    grading_status?: string
    status?: string
  }
  selectedResponseAnswers?: IAnswer[]
  constructedResponseAnswers?: IAnswer[]
}

export interface MultipleQuestionProps {
  questions: MultipleQuestionsData
  className?: string
  multipleQuestionRef?: React.RefObject<HTMLDivElement>
  setOpenAnnotaion: (open: boolean) => void
}

export interface IQuizPositionMapping {
  position: number
  questionId: string
}

export interface IAtempt {
  id: string
  quiz_position_mapping: IQuizPositionMapping[]
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

export interface IRequirement {
  id: string
  name: string
  type?: 'TEXT' | 'FILE'
  description: string
  files?: IFile[]
  answer_file?: {
    file_key: string
    file_name: string
  }
  explanation?: string
}
