import { createContext, useContext } from "react";
import { QueryClient } from "react-query";
import {
  IActivityAPI,
  IAuthAPI,
  IAuthManager,
  ICaseStudyAPI,
  IClassAPI,
  ICourseActivityAPI,
  ICoursesAPI,
  IEntranceTestAPI,
  IEventTestAPI,
  INotificationAPI,
  IQuestionAPI,
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
}

const FeatureContext = createContext<FeatureContextProps>(
  {} as FeatureContextProps,
);

export const useFeature = () => useContext(FeatureContext);

export const FeatureProvider = FeatureContext.Provider;
