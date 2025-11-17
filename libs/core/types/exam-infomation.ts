import { IMetaData } from "./api-response"

export interface UserExamInformation {
  success: boolean;
  data: UserExamInformationData
}

export interface UserExamInformationData {
  data: Data2;
}

export interface Data2 {
  metadata: IMetaData
  data: IExamInformation[]
}

export interface IExamInformation {
  id: string
  started_at: string
  finished_at: string
  user_id: string
  examination_subject_id: string
  is_final_examination_subject: boolean
  defer_examination_reason: any
  class: Class
  examination_subject: ExaminationSubject
  remaining_changes: number
}

export interface Class {
  id: string
  code: string
  course: IClassCourse
}

export interface IClassCourse {
  id: string;
  name: string;
  course_categories: ISimpleCourseCategory[];
  subject: ISimpleSubject;
}

export interface ISimpleCourseCategory {
  id: string;
  name: string;
}

export interface ISimpleSubject {
  id: string
  name: string
  code: string
}

export interface ExaminationSubject {
  id: string
  code_exam: string
  start_date: any
  end_date: string
  examination: ISimpleExamination
}

export interface ISimpleExamination {
  id: string;
  name: string;
}
