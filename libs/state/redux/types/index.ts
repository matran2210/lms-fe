import { ChangePasswordReq, ResetPassword, SendEmailReq, VerifyOtpReq } from "./Login/login";

export interface IResponse<T> {
  success: boolean;
  data: T;
  error: IResponseError;
}

export interface IResponseError {
  code: string;
  message: string;
  others: any;
}

export interface IMeta {
  total_pages: number;
  total_records: number;
  page_index: number;
  page_size: number;
}

export interface IResponseMeta<T, K extends string> {
  success: boolean;
  data: {
    meta: IMeta;
  } & {
    [propertyName in K]: T[];
  };
  error: IResponseError;
}
export interface INotificationAPI {
  getCountUnRead: () => Promise<any>
  getNotification: (params: Object) => Promise<any>
  getDetail: (id: string) => Promise<any>
  markAll: () => Promise<any> 
  markById: (ids: string[], markRead: boolean) => Promise<any>
}

export interface IAuthAPI {
  sendEmail: (request: SendEmailReq) => Promise<any>
  verifyOtp: (data: VerifyOtpReq) => Promise<any>
  changePassword: (data: ChangePasswordReq) => Promise<any>
  updateUser: (
    full_name: string,
    avatar?: { [key: string]: string } | null,
  ) => Promise<IResponse<{ message: string }>>
  makeContactDefault: (id: string) => Promise<any>
  removeDevice: (session_id: string) => Promise<any>
  changeUserPassword: (current_password: string) => Promise<any>
  verifyOTPPassword: (
    current_password: string,
    new_password: string,
    otp_code: string,
  ) => Promise<any>
}