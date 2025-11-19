import {
  ICreateDiscussionRequest,
  ICreateDiscussionResReact,
  ICreateDiscussionUploadRequest,
} from "../../state/redux/types/Course/MyCourse/Activity/activity";
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
}
export interface IActivityAPI {
  createDiscussionComment: (request: ICreateDiscussionRequest) => Promise<any>;
  reactDiscussion: (data: ICreateDiscussionResReact) => Promise<any>;
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
  ) => Promise<IResponse<IQuestion>>
}