export interface Answer {
  answer_file?: {
    file_key?: string
    file_name?: string
  }
  answer: string | string[] | Object[]
  attempted?: boolean
  done?: boolean
  flag?: boolean
  id?: string
  index?: string
  qType?: string
  question_topic_id?: string
  response_type?: number
  timeSpent?: number
  viewed?: boolean
  data?: IDataQuestion
}
export interface ScratchPadValue {
  id: string
  value: string
}
export interface ScratchPad {
  question_id: string
  id: string
  scratch_pad: string
}

export interface FileType {
  file_key: string
  file_name: string
}

export interface Requirement {
  id: string | number
  created_at?: string
  name: string
  description: string
  files: FileType[]
  answer_file?: FileType | null
  answer_text?: string
}

export interface RequirementItem {
  question_id: string
  short_answer: string
  requirement_id: string
  time_spent: number
  active: string
  answer_file?: FileType | null
}

export interface DataType {
  requirements: Requirement[]
}

export type TabItem = {
  id: string
  data: DataType
  answer_file?: FileType
}

export type AnswerList = {
  [key: string]: string | undefined
}

export interface DragDropAnswerItem {
  id: string
  idAnswer?: string
  value: string
  position: number
}
export interface AnswerItem extends DragDropAnswerItem {
  question_id: string
  answer_id: string
  answer_position: number
  answer_text: string
}

export interface IDataQuestion {
  id: string
  key: string
  question_content: string
  level: string
  qType: string
  assignment_type: string
  response_option: string
  display_type: string
  status: string
  is_self_reflection: boolean
  question_topic: QuestionTopic
  answers: any[]
  question_matchings: any[]
  files: any[]
  exhibits: any[]
  requirements: Requirement[]
}

export interface QuestionTopic {
  id: string
  description: string
  files: FileQuestion[]
  exhibits: ExhibitQuestion[]
}

export interface FileQuestion {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  dom_id: any
  type: string
  object_id: string
  resource_id: string
  course_id: any
  for_editor: boolean
  resource: Resource
}

export interface Resource {
  id: string
  name: string
  file_key: string
  stream_url: any
  cloudflare_video_id: any
  status: string
  url: string
  url_expired_in: any
  sub_url: any
}

export interface ExhibitQuestion {
  id: string
  created_at: string
  updated_at: string
  deleted_at: any
  question_topic_id: string
  question_id: any
  name: string
  description: string
  files: FileQuestion[]
}

export interface Sheet {
  name: string
  id: string
  status: number
  data: (any | null)[][]
  celldata: any[]
}
