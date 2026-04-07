export * from "./Question";
export * from "./my-course";
export * from "./exam-info";
export * from "./activity";
export * from "./storyline";

export type CourseProgram =
  | ECourseProgram.ACCA
  | ECourseProgram.CERT_DIP
  | ECourseProgram.CFA
  | ECourseProgram.CMA
  | ECourseProgram.LD;

export enum ECourseProgram {
  CMA = "CMA",
  CFA = "CFA",
  ACCA = "ACCA",
  CERT_DIP = "CERT_DIP",
  LD = "L&D Courses",
}

export interface ISubjectWaitingActivation {
  subject_id: string;
  subject_name: string;
  class_code: string;
  activation_expiry_date: string;
  can_active: boolean;
}

export interface ISubjectByProgram {
  id: string;
  name: string;
  code: string;
  course_category_id: string;
  created_at: string;
  updated_at: string;
}

export interface IClassForActivation {
  id: string;
  finished_at: string;
  started_at: string;
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

export interface ISurveyCustom {
  id: string;
  name: string;
  setting: {
    show_after_start_date: number | null;
    show_by_progress: number | null;
  };
  url: string;
}
