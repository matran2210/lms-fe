import {
  ChangePasswordReq,
  ExaminationsResponse,
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
  IResponse,
  SendEmailReq,
  VerifyOtpReq,
} from "../../state";
import { ExamInformation, IQuestion } from "./course";
import { IExamPrediction, ILearningResult, IMockTestResult, IOverProgress, ITopicProgress, IWeeklyReport } from "./dashboard";
import { ICertificate } from "./Profile";
import {
  IAnswerQuizLastestAttempt,
  IQuizResultList,
  IScoreDetails,
} from "./quiz";
import { AxiosPromise, AxiosResponse } from "axios";

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
  getCertificate: (pageSize: number, pageIndex: number) => Promise<any>;
}

export interface IUploadAPI {
  downloadFile: (data: {
    files: {
      name: string;
      file_key: string;
    }[];
  }) => Promise<void>;
  startUpload: (data: {
    content_type: string;
    name: string;
    size: string;
    blob: Blob;
    description: string;
    getProgress: (percent: number) => void;
    location: string;
  }) => Promise<
    IResponse<{
      type: string;
      file_key: string;
      upload_url: string;
      name: string;
    }>
  >;
  getUrlFile: (file_key: string) => Promise<
    IResponse<{
      cloudflare_video_token: string | null;
      url_expired_in: string | null;
      url: string;
      sub_url: string | null;
    }>
  >;
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
export interface ITestServiceAPI {
  getQuestionAnswer: (id: string) => Promise<any>;
  getQuestionDetail: (
    questionId: string,
    query?: QuestionDetailQueryDTO | undefined,
  ) => Promise<IResponse<IQuestion>>;
  getDetailQuizById: (id: string | string[] | undefined) => Promise<any>;
  getQuestionTabsById: (id: string | string[] | undefined) => Promise<any>;
  submitAllQuestion: (id: string, data?: any) => Promise<any>;
  submitAnswer: (id: string, data: any) => Promise<any>;
  updateFlagInQuestion: (
    quiz_attempt_id: string,
    payload: {
      question_id: string;
      flag: boolean;
      answer?:
        | {
            question_id: string;
            requirement_id: string;
          }[]
        | undefined;
    },
  ) => Promise<any>;
  createQuizAttempt: (
    id: string | string[] | undefined,
    class_user_id: string | undefined,
  ) => Promise<any>;
  createTopicAttempt(
    quiz_id: string,
    question_topic_id: string,
    class_user_id?: string | undefined,
    story_topic_id?: string | string[] | undefined,
  ): Promise<any>;
  submitCaseStudy: (id: string, data: any) => Promise<any>;
  getAnswersSubmitted: (id: string) => Promise<any>;
  submitQuizTest: (
    id: string,
    data: any,
    class_user_id?: string | undefined,
  ) => Promise<any>;
  getTopicDescription: (
    id: string | string[] | undefined,
    quiz_id?: string | undefined,
    class_user_id?: string | undefined,
    cache?: boolean,
    include_questions?: boolean,
  ) => Promise<any>;
  downloadFile: (data: {
    files: {
      name: string;
      file_key: string;
    }[];
  }) => Promise<void>;
  startUpload: (data: {
    content_type: string;
    name: string;
    size: string;
    blob: Blob;
    description: string;
    getProgress: (percent: number) => void;
    location: string;
  }) => Promise<
    IResponse<{
      type: string;
      file_key: string;
      upload_url: string;
      name: string;
    }>
  >
}

export interface ICertificateAPI {
  uploadImageToLinkedIn: (
    token: string,
    personURN: string,
    shareUrl: string,
    text: string,
    imageBase64: string,
  ) => Promise<AxiosResponse<any, any, {}>>;
}
export interface IDashboardAPI {
  getOverProgress: (id: string) => Promise<IResponse<IOverProgress>>

  getTopicProgress:(id: string)=> Promise<IResponse<ITopicProgress[]>>

  getWeeklyReport:(id: string)=>Promise<IResponse<IWeeklyReport>>

  getLearningResults:(id: string)=> Promise<IResponse<ILearningResult[]>> 

  getMockTestResults:(id: string)=> Promise<IResponse<IMockTestResult>>

  getExamPrediction:(id: string)=> Promise<IResponse<IExamPrediction>> 
}

export interface ICourseActivationAPI {
  get: (
    params: Object,
    page_index?: number,
    page_size?: number,
  ) => Promise<any>;
  getSubjectByProgram: (program_name?: string) => Promise<any>;
  activateClass: (class_id: string) => Promise<any>;
  getSubjectClassForActivateSubject: (subject_id: string) => Promise<any>;
}
