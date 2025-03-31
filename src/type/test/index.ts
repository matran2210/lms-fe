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
  created_at: string
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
  idAnswer: string
  value: string
}
export interface AnswerItem extends DragDropAnswerItem {
  question_id: string
  answer_id: string
  answer_position: number
  answer_text: string
}
