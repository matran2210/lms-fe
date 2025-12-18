import { createContext, useContext } from "react";
import {
  AxiosRequestConfig,
} from 'axios'
import { QueryClient } from "react-query";
import {
  IActivityAPI,
  IAuthAPI,
  IAuthManager,
  ICalendarAPI,
  ICaseStudyAPI,
  IClassAPI,
  ICourseActivityAPI,
  ICoursesAPI,
  IEntranceTestAPI,
  IEventTestAPI,
  INotificationAPI,
  IQuestionAPI,
  ITestServiceAPI,
  IUploadAPI,
  MenuItem,
} from "@lms/core";
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
  caseStudyApi: ICaseStudyAPI;
  entranceTestApi?: IEntranceTestAPI;
  eventTestApi?: IEventTestAPI;
  calendarApi?: ICalendarAPI;
  myProfileApi?: {
      getProfile: () => Promise<any>;
    getSubjectOfhubspot: (courseCategoryName: string) => Promise<any>;
    getExamBySubjectId: ({ pageIndex, pageSize, params, }: {
        pageIndex: number;
        pageSize: number;
        params?: Object | undefined;
    }) => Promise<any>;
    updateProgram: (data: {
        course_category_id?: string | undefined;
        user_hubspot_examination_subjects?: {
            examination_subject_id?: string | undefined;
        }[] | undefined;
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
  fetcher: (url: string, config?: AxiosRequestConfig<any>) => Promise<any>
  videoUrl: string;
  testServiceApi: ITestServiceAPI;
}

const FeatureContext = createContext<FeatureContextProps>(
  {} as FeatureContextProps,
);

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = FeatureContext.Provider;
