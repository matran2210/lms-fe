import {
  ChangePasswordReq,
  ExaminationsResponse,
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
  SendEmailReq,
  VerifyOtpReq,
} from "../../state";
import { IResponse } from "./api-response";
import { ExamInformation, IQuestion } from "./course";
import {
  IAnswerQuizLastestAttempt,
  IQuizResultList,
  IScoreDetails,
} from "./quiz";
import { AxiosPromise } from "axios";

export interface IAuthManager {
  getToken(): string;
  refreshToken(): Promise<string | null>;
  logout(): Promise<void>;
}
export interface IEventTestAPI {
  get: (params: object) => Promise<any>;
  getCount: () => Promise<any>;
}
export interface IEntranceTestAPI {
  getEntranceCount: () => Promise<any>;
  getListUnivers: () => Promise<any>;
  getListUniversProgram: () => Promise<any>;
  getListMajors: () => Promise<any>;
  getListEngLevel: () => Promise<any>;
  putLevel: (data: any) => Promise<any>;
}

export interface ICaseStudyAPI {
  getTopicQuiz: (
    id: string | string[] | undefined,
    quiz_id: string | string[] | undefined,
  ) => Promise<any>;
}
export interface ICoursesAPI {
  getCourseActivityTapById: (courseId: string, id: string) => Promise<any>;
  getDiscussion: (
    class_id: string,
    course_section_id: string,
  ) => Promise<any>;
  getQuizAttemptsAnswer: ({
    attempt_id,
    question_id,
  }: {
    attempt_id: string;
    question_id: string;
  }) => Promise<{
    success: boolean;
    data: IAnswerQuizLastestAttempt;
  }>;
  getCourseSubsectionList: (
    page_size: number,
    type: "CHAPTER" | "UNIT" | "ACTIVITY",
    parentId?: string,
    classId?: string,
    page_index?: number,
    params?: object,
  ) => Promise<any>;
  getCourseSectionList: (
    id: string | string[] | undefined,
    page_size: number,
    page_index?: number,
  ) => Promise<any>;
  getTopicDescription: (
    id: string | string[] | undefined,
    quiz_id?: string,
    class_user_id?: string,
    cache?: boolean,
  ) => Promise<any>;
  getQuizAttemptsTable: (
    id: string,
    {
      page_index,
      page_size,
      no_group_view,
    }: { page_index: number; page_size: number; no_group_view?: boolean },
  ) => Promise<{
    success: boolean;
    data: IScoreDetails;
  }>;
  CACHE_GET_TOPIC_DESCRIPTION: {
    [key: string]: any;
  };
  getCourseNotesList: (
    page_index: number,
    page_size: number,
    params?: object,
  ) => Promise<any>;
  deleteCourseNoteList: (id: string) => Promise<any>;
  getDiscussionStudentInfo: (
    course_section_id: string,
    class_id: string,
    user_id: string,
  ) => Promise<any>;
  createNote: (params: object) => Promise<any>;
  updateCourseNotesList: (
    id: string | undefined,
    params?: object,
  ) => Promise<any>;
  userGuideActive: () => Promise<any>;
  getCourseResource: (
    id: string | string[] | undefined,
    params?: object,
  ) => Promise<any>;
  getCourseResults?: (
    id: string | string[],
    params: object,
  ) => Promise<any>;
  getCourseResults3Level?: (
    id: string | string[],
    page_index: number,
    page_size: number,
    params: object,
  ) => Promise<any>;
  upgradeNowTrial: (id: string | string[] | undefined) => Promise<any>;
  activeCourse: (params: object) => Promise<any>;
  extendCourse: (params: object) => Promise<any>;
  skipFoundation: (
    class_id: string | undefined,
  ) => Promise<{ success: boolean }>;
  submitAllQuestion: (id: string, data?: any) => Promise<any>;
}
export interface IActivityAPI {
  createDiscussionComment: (
    request: ICreateDiscussionRequest,
  ) => Promise<any>;
  reactDiscussion: (data: ICreateDiscussionResReact) => Promise<any>;
  getQuizAttemptsAnswer: (id: string) => Promise<any>;
  updateDiscussionComment: (
    id: string | undefined,
    params?: object,
  ) => Promise<any>;
  deleteDiscussion: (id: string) => Promise<any>;
}

export interface ICourseActivityAPI {
  uploadImagesDiscussion: ({
    discussion_id,
    new_discussion_file,
    discussion_file_ids,
  }: ICreateDiscussionUploadRequest) => Promise<any>;
}
type QuestionDetailQueryDTO = {
  after_test: boolean;
};
export interface IQuestionAPI {
  getQuestionDetail: (
    questionId: string,
    query?: QuestionDetailQueryDTO,
  ) => Promise<IResponse<IQuestion>>;
}

export interface INotificationAPI {
  getCountUnRead: () => Promise<any>;
  getNotification: (params: object) => Promise<any>;
  getDetail: (id: string) => Promise<any>;
  markAll: () => Promise<any>;
  markById: (ids: string[], markRead: boolean) => Promise<any>;
}

export interface IAuthAPI {
  sendEmail: (request: SendEmailReq) => Promise<any>;
  verifyOtp: (data: VerifyOtpReq) => Promise<any>;
  changePassword: (data: ChangePasswordReq) => Promise<any>;
  updateUser: (
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ) => Promise<IResponse<{ message: string }>>;
  makeContactDefault: (id: string) => Promise<any>;
  removeDevice: (session_id: string) => Promise<any>;
  changeUserPassword: (current_password: string) => Promise<any>;
  verifyOTPPassword: (
    current_password: string,
    new_password: string,
    otp_code: string,
  ) => Promise<any>;
}

export interface IUploadAPI {
  downloadFile: (data: {
    files: {
      name: string;
      file_key: string;
    }[];
  }) => Promise<void>;
}

export interface IClassAPI {
  getAllResultOfQuiz: (
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ) => Promise<IResponse<IQuizResultList>>;
  getExamInfo: (id: string) => Promise<ExamInformation>;
  changeExamDate: (
    id: string,
    data: FormData,
  ) => AxiosPromise<IResponse<any>>;
  getExams: (
    id: string,
    params: { page_index: number; page_size: number },
  ) => Promise<ExaminationsResponse>;
}
export interface ICalendarAPI {
  getEventSchedule: (params?: object | undefined) => Promise<any>;
  getDetailEvent: (id: string, is_holiday: boolean) => Promise<any>;
}