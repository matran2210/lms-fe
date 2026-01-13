import { IMetaData } from '@lms/core'
import { UploadFile } from 'antd'

export interface ExaminationsResponse {
  metadata: IMetaData
  data: Exam[]
  current_exam_name: string
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
