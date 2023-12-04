export interface IFile {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string
  dom_id: string
  type: string
  object_id: string
  resource_id: string
  resource: {
    id: string
    name: string
    file_key: string
    stream_url: string
    cloudflare_video_id: string
    time_line: any[]
    status: string
    url: string
    url_expired_in: string
    sub_url: string
  }
}
export interface IVideo {
  file: IFile
  quiz?: {
    id: string
    constructed_questions: IQuestion[]
    multiple_choice_questions: IQuestion[]
  }
}
export enum QUESTION_LEVELS {
  FUNDAMENTAL = 'FUNDAMENTAL',
  ADVANCED = 'ADVANCED',
}
export enum QUESTION_ASSIGNMENT_TYPE {
  FILE = 'FILE',
  TEXT = 'TEXT',
  ALL = 'ALL',
}
export enum QUESTION_RESPONSE_OPTION {
  WORD = 'WORD',
  SHEET = 'SHEET',
  NONE = 'NONE',
}
export enum QUESTION_TYPES {
  TRUE_FALSE = 'TRUE_FALSE',
  ONE_CHOICE = 'ONE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING',
  SELECT_WORD = 'SELECT_WORD',
  FILL_WORD = 'FILL_WORD',
  DRAG_DROP = 'DRAG_DROP',
  ESSAY = 'ESSAY',
}

export interface IQuestionAnswer {
  is_correct: boolean
  answer: string
  answer_position: number
}

export interface IQuestion {
  id?: string
  qType?: QUESTION_TYPES
  assignment_type: string
  response_option?: string | null
  level: QUESTION_LEVELS
  display_type: string
  question_content: string
  solution: string
  hint: string
  tags?: IQuestionTag[]
  answers?: IQuestionAnswer[]
  question_matchings?: {
    content: string
    answer: IQuestionAnswer
  }[]
  question_filter?: {
    course_id: string
    chapter_id: string
    unit_id: string
    activity_id: string
    part_id: string
  }
  question_category_id?: string
  question_topic_id?: string
  requirements?: {
    name: string
    type?: 'TEXT' | 'FILE'
    description: string
    files?: IFile[]
  }[]
  exhibits?: {
    name: string
    type?: 'TEXT' | 'FILE'
    description: string
    files?: IFile[]
  }[]
  files?: IFile[]

  setting_grade?: string
  time?: string
}

export enum ANSWER_CORRECT_TYPE {
  T = 'T',
  F = 'F',
}

export interface IQuestionTag {
  id?: string
  name?: string
  description?: string
}
export interface IQuestionCategory {
  id?: string
  name?: string
  description?: string
}
