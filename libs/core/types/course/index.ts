export * from './Question'
export * from './my-course'
export * from './exam-info'
export * from "./activity"

export type CourseProgram =
  | ECourseProgram.ACCA
  | ECourseProgram.CERT_DIP
  | ECourseProgram.CFA
  | ECourseProgram.CMA

export enum ECourseProgram {
  CMA = 'CMA',
  CFA = 'CFA',
  ACCA = 'ACCA',
  CERT_DIP = 'CERT_DIP',
}

export interface ISubjectWaitingActivation {
  subject_id: string
  subject_name: string
  class_code: string
  activation_expiry_date: string
  can_active: boolean
}

export interface ISubjectByProgram {
  id: string
  name: string
  code: string
  course_category_id: string
  created_at: string
  updated_at: string
}

export interface IClassForActivation {
  id: string;
  finished_at: string;
  code: string;
  name: string;
  examination_subject: {
    id: string;
    examination: {
      id: string;
      name: string;
    };
  };
}

