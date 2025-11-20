import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
} from "../../state/redux/types/Course/MyCourse/Activity/activity";
import { ChangePasswordReq, SendEmailReq, VerifyOtpReq } from "../../state/redux/types/Login/login";
import { IResponse } from "./api-response";
import { IQuestion } from "./course";
import { IAnswerQuizLastestAttempt } from "./quiz";

export interface IAuthManager {
  getToken(): string;
  refreshToken(): Promise<string | null>;
  logout(): Promise<void>;
}
export interface IEventTestAPI {
  get: (params: Object) => Promise<any>;
  getCount: () => Promise<any>;
}
export interface IEntranceTestAPI {
  getEntranceCount: () => Promise<any>;
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
  getCourseSubsectionList: (
    page_size: number,
    type: "CHAPTER" | "UNIT" | "ACTIVITY",
    parentId?: string,
    classId?: string,
    page_index?: number,
    params?: Object,
  ) => Promise<any>;
  getCourseSectionList: (
    id: string | string[] | undefined,
    page_size: number,
    page_index?: number,
  ) => Promise<any>;
  getTopicDescription:(
    id: string | string[] | undefined,
    quiz_id?: string,
    class_user_id?: string,
    cache?: boolean,
  ) => Promise<any>;
}
export interface IActivityAPI {
  createDiscussionComment: (request: ICreateDiscussionRequest) => Promise<any>;
  reactDiscussion: (data: ICreateDiscussionResReact) => Promise<any>;
  getQuizAttemptsAnswer:(id: string) => Promise<any>;
}

export interface CourseActivityApi {
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
  getNotification: (params: Object) => Promise<any>;
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
}) => Promise<void>
}