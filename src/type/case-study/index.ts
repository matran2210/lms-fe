import { IMetaData } from '..'
import { IFile } from '../course'

export interface ICaseStudyResult {
  meta: IMetaData
  answers: IAnswerResult[]
  previous_topic: ICaseStudyPage & ICaseStudyResultPage
  next_topic: ICaseStudyPage & ICaseStudyResultPage
  quiz_id: string
  program: string
}

export interface ICaseStudyPage {
  id: string
  position: number
  question_topic_id: string
}

export interface ICaseStudyResultPage {
  id: string
  question_topic_id: string
  position: number
  attempt: {
    id: string
  }
}

export interface IExhibit {
  id: string
  name: string
  description: string
  files: IFile[]
  updated_at: Date
  created_at: Date
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

export interface IAnswerResult {
  id: string
  question_id: string
  question_answer_id: string
  short_answer: string
  answer: any
  response_option: string
  is_correct: boolean
  time_spent: number | string
  active: boolean
  topic_attempt_id: string
  requirement_id: string
  question: IQuestionResult
}

export interface IQuestionResult {
  id: string
  question_content: string
  level: string
  qType: string
  solution: string
  hint: string
  explanation: string
  files: IFile
  answers: any[]
  question_matchings: {
    answer: {
      id: string
      answer: string
      is_correct: boolean
      answer_position: number
    }
    content: string
    id: string
  }[]
  question_filter: {
    id: string
    part: {
      id: string
      name: string
      short_name: string
    }
  }
  exhibits: IExhibit[]
  requirements: IRequirement[]
  response_option: string
  question_report: {
    ratio: string
    average_time: string
  }
  question_topic: ITopic
}

export interface ITopic {
  id: string
  name: string
  description: string
  display_type: string
  files: IFile[] | []
  exhibits: IExhibit[] | []
  case_study_name?: string
  qType: string
  requirements: IRequirement[]
}

export interface ICratchPad {
  file?: string
  fileName?: string
  id?: string
  type?: string
}
