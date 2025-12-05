export interface IExhibit {
  description?: string
  files: any[]
  id: string
  name: string
  question_id?: string
  question_topic_id?: string
  updated_at: Date
  created_at: Date
  deleted_at?: Date
}

export interface IExhibitData {
  description?: string
  files?: any[]
  index?: number
  name?: string
  type?: string
}
