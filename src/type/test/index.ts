export interface Answer {
  answer: string | string[] | Object[]
  attempted?: boolean
  done?: boolean
  flaged?: boolean
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
