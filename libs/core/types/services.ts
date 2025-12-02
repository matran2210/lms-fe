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
  get: (params: object) => Promise<unknown>;
  getCount: () => Promise<unknown>;
}
export interface IEntranceTestAPI {
  getEntranceCount: () => Promise<unknown>;
  getListUnivers: () => Promise<unknown>;
  getListUniversProgram: () => Promise<unknown>;
  getListMajors: () => Promise<unknown>;
  getListEngLevel: () => Promise<unknown>;
  putLevel: (data: unknown) => Promise<unknown>;
}

export interface ICaseStudyAPI {
  getTopicQuiz: (
    id: string | string[] | undefined,
    quiz_id: string | string[] | undefined,
  ) => Promise<unknown>;
}
export interface ICoursesAPI {
  getCourseActivityTapById: (courseId: string, id: string) => Promise<unknown>;
  getDiscussion: (
    class_id: string,
    course_section_id: string,
  ) => Promise<unknown>;
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
  ) => Promise<unknown>;
  getCourseSectionList: (
    id: string | string[] | undefined,
    page_size: number,
    page_index?: number,
  ) => Promise<unknown>;
  getTopicDescription: (
    id: string | string[] | undefined,
    quiz_id?: string,
    class_user_id?: string,
    cache?: boolean,
  ) => Promise<unknown>;
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
    [key: string]: unknown;
  };
  getCourseNotesList: (
    page_index: number,
    page_size: number,
    params?: object,
  ) => Promise<unknown>;
  deleteCourseNoteList: (id: string) => Promise<unknown>;
  getDiscussionStudentInfo: (
    course_section_id: string,
    class_id: string,
    user_id: string,
  ) => Promise<unknown>;
  createNote: (params: object) => Promise<unknown>;
  updateCourseNotesList: (
    id: string | undefined,
    params?: object,
  ) => Promise<unknown>;
  userGuideActive: () => Promise<unknown>;
  getCourseResource: (
    id: string | string[] | undefined,
    params?: object,
  ) => Promise<unknown>;
  getCourseResults?: (
    id: string | string[],
    params: object,
  ) => Promise<unknown>;
  getCourseResults3Level?: (
    id: string | string[],
    page_index: number,
    page_size: number,
    params: object,
  ) => Promise<unknown>;
  upgradeNowTrial: (id: string | string[] | undefined) => Promise<unknown>;
  activeCourse: (params: object) => Promise<unknown>;
  extendCourse: (params: object) => Promise<unknown>;
  skipFoundation: (
    class_id: string | undefined,
  ) => Promise<{ success: boolean }>;
  submitAllQuestion: (id: string, data?: unknown) => Promise<any>;
}
export interface IActivityAPI {
  createDiscussionComment: (
    request: ICreateDiscussionRequest,
  ) => Promise<unknown>;
  reactDiscussion: (data: ICreateDiscussionResReact) => Promise<unknown>;
  getQuizAttemptsAnswer: (id: string) => Promise<unknown>;
  updateDiscussionComment: (
    id: string | undefined,
    params?: object,
  ) => Promise<unknown>;
  deleteDiscussion: (id: string) => Promise<unknown>;
}

export interface ICourseActivityAPI {
  uploadImagesDiscussion: ({
    discussion_id,
    new_discussion_file,
    discussion_file_ids,
  }: ICreateDiscussionUploadRequest) => Promise<unknown>;
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
  getCountUnRead: () => Promise<unknown>;
  getNotification: (params: object) => Promise<unknown>;
  getDetail: (id: string) => Promise<unknown>;
  markAll: () => Promise<unknown>;
  markById: (ids: string[], markRead: boolean) => Promise<unknown>;
}

export interface IAuthAPI {
  sendEmail: (request: SendEmailReq) => Promise<unknown>;
  verifyOtp: (data: VerifyOtpReq) => Promise<unknown>;
  changePassword: (data: ChangePasswordReq) => Promise<unknown>;
  updateUser: (
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ) => Promise<IResponse<{ message: string }>>;
  makeContactDefault: (id: string) => Promise<unknown>;
  removeDevice: (session_id: string) => Promise<unknown>;
  changeUserPassword: (current_password: string) => Promise<unknown>;
  verifyOTPPassword: (
    current_password: string,
    new_password: string,
    otp_code: string,
  ) => Promise<unknown>;
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
  ) => AxiosPromise<IResponse<unknown>>;
  getExams: (
    id: string,
    params: { page_index: number; page_size: number },
  ) => Promise<ExaminationsResponse>;
}
export interface ICalendarAPI {
  getEventSchedule: (params?: object | undefined) => Promise<any>;
  getDetailEvent: (id: string, is_holiday: boolean) => Promise<any>;
}