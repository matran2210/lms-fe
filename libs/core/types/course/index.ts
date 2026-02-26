export * from './Question'
export * from './my-course'
export * from './exam-info'
export * from "./activity"
export * from "./storyline"

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
