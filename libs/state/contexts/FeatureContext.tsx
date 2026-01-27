"use client";
import {
  IActivityAPI,
  IAuthAPI,
  IAuthManager,
  ICalendarAPI,
  ICertificateAPI,
  IClassAPI,
  ICourseActivityAPI,
  ICoursesAPI,
  IDashboardAPI,
  IEntranceTestAPI,
  IEventTestAPI,
  INotificationAPI,
  IQuestionAPI,
  ITestServiceAPI,
  IUploadAPI,
  MenuItem
} from "@lms/core";
import {
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { createContext, useContext } from "react";
import { IUserAPI } from "../redux/types/User/urser";
interface FeatureContextProps {
  courseApi: ICoursesAPI;
  questionApi: IQuestionAPI;
  uploadApi: IUploadAPI;
  userApi: IUserAPI;
  notificationApi: INotificationAPI;
  authApi: IAuthAPI;
  classApi: IClassAPI;
  activityApi: IActivityAPI;
  courseActivityApi: ICourseActivityAPI;
  entranceTestApi?: IEntranceTestAPI;
  eventTestApi?: IEventTestAPI;
  calendarApi?: ICalendarAPI;
  dashboardApi?: IDashboardAPI;
  myProfileApi?: {
    getProfile: () => Promise<any>;
    getSubjectOfhubspot: (courseCategoryName: string) => Promise<any>;
    getExamBySubjectId: ({
      pageIndex,
      pageSize,
      params,
    }: {
      pageIndex: number;
      pageSize: number;
      params?: Object | undefined;
    }) => Promise<any>;
    updateProgram: (data: {
      course_category_id?: string | undefined;
      user_hubspot_examination_subjects?:
        | {
            examination_subject_id?: string | undefined;
          }[]
        | undefined;
    }) => Promise<any>;
  };
  submitQuizTest: (
    id: string,
    data: any,
    class_user_id?: string | undefined,
  ) => Promise<any>;
  authManager: IAuthManager;
  pageLink: { [key: string]: string };
  menuItems: MenuItem[];
  menuItemsEvent: MenuItem[];
  menuBottom: MenuItem[];
  router: any;
  pathname: string | null
  params: Record<string, string | string[]> | null
  query: any
  certificateApi: ICertificateAPI
  fetcher: (url: string, config?: AxiosRequestConfig<any>) => Promise<any>;
  videoUrl: string;
  testServiceApi: ITestServiceAPI;
  uploadImageToLinkedIn: (
    token: string,
    personURN: string,
    shareUrl: string,
    text: string,
    imageBuffer: string
  ) => Promise<AxiosResponse<any, any, {}>>;
}

const FeatureContext = createContext<FeatureContextProps>(
  {} as FeatureContextProps,
);

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = FeatureContext.Provider;
