import { UploadFile } from 'antd'

export interface ExaminationsResponse {
  metadata: Metadata
  data: Exam[]
  current_exam_name: string
}

export interface Metadata {
  total_pages: number
  total_records: number
  page_index: number
  page_size: number
}

export interface Exam {
  id: string
  subject_id: string
  start_date: any
  end_date: string
  examination: Examination
  classes: Class[]
}

export interface Examination {
  id: string
  name: string
}

export interface Class {
  id: string
  class_user_instances: any[]
}

export interface ExaminationForm {
  examination_subject_id: string
  note: UploadFile[]
}

export interface ExaminationPut {
  examination_subject_id: string
  note: string
}

export interface IChangeExam {
  id: string
  data: ExaminationPut
}
