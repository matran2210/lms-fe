import { AxiosPromise, AxiosResponse } from "axios";
import {
  ChangePasswordReq,
  ExaminationsResponse,
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
  ICreateSchedulePayload,
  IResponse,
  IResponseSchedule,
  IWeeklyNorm,
  SendEmailReq,
  VerifyOtpReq,
} from "../../state";
import { IAttendanceStatistics, IClassAttendanceHistoryResponse, ILessonListParams, IStudentAttendanceListParams, IStudentAttendanceListResponse, IStudentLessonListResponse, ITeacherTeachingClassListResponse, ITeacherTeachingLessonListResponse } from "./attendance";
import {
  IClassResourceList,
  IClassResourcePreview,
  IListClassResourceParams,
  ISubjectList,
} from "./classes";
import { IQueryParams } from "./common";
import {
  CourseDetail,
  DocumentItem,
  ExamInformation,
  IQuestion,
  IStoryline,
} from "./course";
import {
  IExamPrediction,
  ILearningResult,
  IMockTestResult,
  IOverProgress,
  ITopicProgress,
  IWeeklyReport,
} from "./dashboard";
import { IEntranceTest } from "./entrance-test";
import {
  IBusyRequestDetailResponse,
  ICreateBusyScheduleData,
  ICreateEditWeeklyNorm,
  ICreateTimeoffRequestData,
  ICreateWeeklyNormData,
  IEditBusyScheduleData,
  IEditTimeoffRequestData,
  IEditWeeklyNormData,
} from "./my-request";
import {
  IProgressList,
  IRequestCreateProgress
} from "./progress";
import {
  IAnswerQuizLastestAttempt,
  IQuizResultList,
  IScoreDetails,
} from "./quiz";
import { IRequestList } from "./request";
import {
  APIDetailScheduleRequestResponse,
  APIListScheduleRequestResponse,
  RequestScheduleParams,
  StatusMultipleRequestScheduleParams,
  StatusRequestScheduleParams,
} from "./teachers/request-schedule.interface";

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
  get: (params: Object) => Promise<IResponse<IEntranceTest[]>>;
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
  getDiscussion: (class_id: string, course_section_id: string) => Promise<any>;
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
  getQuizAttemptsTableEntranceTest(
    id: string,
    { page_index, page_size }: { page_index: number; page_size: number },
  ): Promise<{
    success: boolean;
    data: IScoreDetails;
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
  getCourseResults?: (id: string | string[], params: object) => Promise<any>;
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
  getCertificate: (id: string | string[] | undefined) => Promise<any>;
  getQuizAttemptsEntranceTestChartData: (
    id: string | string[] | undefined,
  ) => Promise<any>;
  getCourseDetail(
    id: string | string[] | undefined,
    page_index: number,
    page_size: number,
    params: Object,
  ): Promise<IResponse<CourseDetail>>;
}
export interface IActivityAPI {
  createDiscussionComment: (request: ICreateDiscussionRequest) => Promise<any>;
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
export interface IQuestionAPI {}

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
  downloadFileClassResource: (
    class_id: string,
    resource_id: string,
  ) => Promise<void>;
}

export interface IClassAPI {
  getAllResultOfQuiz: (
    id: string,
    quiz_id: string,
    params?: { page_index: number; page_size: number },
  ) => Promise<IResponse<IQuizResultList>>;
  getExamInfo: (id: string) => Promise<ExamInformation>;
  changeExamDate: (id: string, data: FormData) => AxiosPromise<IResponse<any>>;
  getExams: (
    id: string,
    params: { page_index: number; page_size: number },
  ) => Promise<ExaminationsResponse>;
  previewClassFile?: (
    class_id: string,
    resource_id: string,
  ) => Promise<IClassResourcePreview>;
  getClassResource?: (
    class_id: string,
    params: IListClassResourceParams,
  ) => Promise<IResponse<IClassResourceList>>;
  getClassSchedule?: (
    id: string,
    page_index: number,
    page_size: number,
    search_key?: string,
  ) => Promise<any>;

  // attendance
  getStudentAttendance(
    class_id: string,
    params: IStudentAttendanceListParams,
  ): Promise<IResponse<IStudentAttendanceListResponse>>;

  getStudentAttendanceSummary(class_id: string): Promise<IResponse<IAttendanceStatistics>>;
  getClassAttendanceHistory(lesson_id: string): Promise<IResponse<IClassAttendanceHistoryResponse>>;
  getStudentLearningSchedule(params: ILessonListParams): Promise<IResponse<IStudentLessonListResponse>>;
  getTeacherLearningSchedule(params: ILessonListParams): Promise<IResponse<ITeacherTeachingLessonListResponse>>;
  getTeacherTeachingClass(params: Omit<ILessonListParams, "class_ids">): Promise<IResponse<ITeacherTeachingClassListResponse>>
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
  >;
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
  getOverProgress: (id: string) => Promise<IResponse<IOverProgress>>;

  getTopicProgress: (id: string) => Promise<IResponse<ITopicProgress[]>>;

  getWeeklyReport: (id: string) => Promise<IResponse<IWeeklyReport>>;

  getLearningResults: (id: string) => Promise<IResponse<ILearningResult[]>>;

  getMockTestResults: (id: string) => Promise<IResponse<IMockTestResult>>;

  getExamPrediction: (id: string) => Promise<IResponse<IExamPrediction>>;
}

export interface IStorylineAPI {
  getListStoryline: ({
    class_id,
    section_storyline_id,
  }: {
    class_id: string;
    section_storyline_id: string;
  }) => Promise<IResponse<IStoryline>>;
  getStorylineDocument: ({
    class_id,
    item_id,
  }: {
    class_id: string;
    item_id: string;
  }) => Promise<IResponse<DocumentItem[]>>;
  retakeStoryline: ({
    class_id,
    course_section_id,
    storyline_item_id,
  }: {
    class_id: string;
    course_section_id: string;
    storyline_item_id?: string | undefined;
  }) => Promise<IResponse<IStoryline>>;
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
export interface ISchedulesAPI {
  get: (params: Object) => Promise<IResponse<IResponseSchedule[]>>;
  create: (
    data: ICreateSchedulePayload,
  ) => Promise<IResponse<IResponseSchedule>>;

  getWeeklyNorms: (
    params: Record<string, any>,
  ) => Promise<IResponse<IWeeklyNorm[]>>;
}

export interface IProgressAPI {
  getProgressList(params: {
    page_index: number;
    page_size: number;
    params?: Record<string, any>;
  }): Promise<IResponse<IProgressList>>;

  getProgressDetail(id: string): Promise<IResponse<any>>;

  getListLesson(classId: string): Promise<IResponse<any[]>>;

  getListSection(
    classId: string,
    scheduleId: string,
    params?: Record<string, any>,
  ): Promise<IResponse<any[]>>;

  createProgress(data: IRequestCreateProgress): Promise<IResponse<any>>;

  updateProgress(
    id: string,
    data: IRequestCreateProgress,
  ): Promise<IResponse<any>>;
}

export interface ITeacherAPI {
  getListClass(
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<any>;

  getClassById(id: string): Promise<any>;

  getStudentById(
    id: string,
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<IResponse<any>>;

  getListTestQuiz(
    id: string,
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<IResponse<any>>;

  getDetailTestQuiz(
    id: string,
    chapter_test_id: string,
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<IResponse<any>>;

  getSubjects(
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<IResponse<ISubjectList>>;

  getCourseCategory(
    page_index: number,
    page_size: number,
    params?: Record<string, any>,
  ): Promise<IResponse<any>>;

  getListRequestSchedule(
    payload: RequestScheduleParams,
  ): Promise<APIListScheduleRequestResponse>;

  getRequestScheduleById(id: string): Promise<APIDetailScheduleRequestResponse>;

  updateStatusRequestSchedule(
    id: string,
    payload: StatusRequestScheduleParams,
  ): Promise<void>;

  updateMultipleStatusRequestSchedules(
    payload: StatusMultipleRequestScheduleParams,
  ): Promise<void>;
}

export interface IMyRequestAPI {
  createBusySchedule(data: ICreateBusyScheduleData): Promise<IResponse<null>>;

  editBusySchedule(
    id: string,
    data: IEditBusyScheduleData,
  ): Promise<IResponse<null>>;

  createWeeklyNorms(
    data: ICreateWeeklyNormData,
  ): Promise<IResponse<ICreateEditWeeklyNorm>>;

  editWeeklyNorm(
    id: string,
    data: IEditWeeklyNormData,
  ): Promise<IResponse<null>>;

  createTimeoffRequest(
    data: ICreateTimeoffRequestData,
  ): Promise<IResponse<string>>;

  editTimeoffRequest(
    id: string,
    data: IEditTimeoffRequestData,
  ): Promise<IResponse<string>>;

  createChangeTeachingModeRequest(
    data: ICreateTimeoffRequestData,
  ): Promise<IResponse<string>>;

  editTeachingModeRequest(
    id: string,
    data: IEditTimeoffRequestData,
  ): Promise<IResponse<string>>;

  getRequestDetail(id: string): Promise<IResponse<IBusyRequestDetailResponse>>;

  getClass(
    page_index: number,
    page_size: number | undefined,
    teacher_id?: string,
  ): Promise<IResponse<any>>;

  getLesson(
    page_index: number,
    page_size: number | undefined,
    teacher_id: string,
    class_id: string,
  ): Promise<IResponse<any>>;
}
export interface IRequestAPI {
  getRequests: ({
    page_index,
    page_size,
    otherParams,
  }: IQueryParams) => Promise<IResponse<IRequestList>>;

  deleteRequest: (id: string) => Promise<IResponse<null>>;
}
