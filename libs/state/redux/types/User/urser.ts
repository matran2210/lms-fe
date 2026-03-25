import {
  IDeviceItem,
  IMetaData,
  IResponse,
  PinnedNotifications,
  PROGRAM,
  UserExamInformation,
} from "@lms/core";

export interface ITemplateConfig {
  template_full: number;
  template_short_course: number;
}

export interface IUser {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  key: string;
  invite_id: null | string;
  code: null | string;
  username: string;
  nick_name: null | string;
  type: UserType;
  status: IUserStatus;
  ekyc_status: null | string;
  approved_date: null | string;
  reject_reason: null | string;
  confirmation_status: null | string;
  detail_id: string;
  detail: IUserDetail;
  facilities?: IFacility[];
  user_contacts: IUserContact[];
  certificates: ITemplateConfig;
  courses: ITemplateConfig;
  university?: IUniversity;
  university_program?: any;
  major?: IMajor;
  english_level?: any;
  main_class?: string[];
  reserve_retook_class?: string[];
  user_hubspot_program_infos?: IUserHubspotProgramInfo[];
  course_tab_groups?: Partial<Record<PROGRAM, ICourseTabGroup>>;
  course_category_id?: string | undefined;
  keycloak_user_id: string;
  hubspot_contact_id?: string;
}
export interface IUserContact {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  is_default: boolean;
  email: string;
  phone: string;
  country_code: string;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  address: string;
  permanent_address: string;
  company_type: string;
  company_position: string;
  company_rank: string;
  province: string;
  district: string;
  ward: string;
}

export interface IFacility {
  code: string;
  id: string;
  name: string;
}

export enum UserType {
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}
export enum IUserStatus {
  ACTIVE = "ACTIVE",
}
export interface IUserDetail {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: null | string;
  country_code: null | string;
  email: string;
  phone: string;
  firstName: null | string;
  lastName: null | string;
  full_name: string;
  address: string;
  major?: IMajor;
  level: string;
  university?: IUniversity;
  provinceCode: null | string;
  districtCode: null | string;
  wardCode: null | string;
  dob: null | string;
  avatar: { [key: string]: string };
  sex: string;
  permanent_address: null | string;
  identity_card: null | string;
  date_of_issue: null | string;
  place_of_issue: null | string;
  identity_card_image_front: any;
  identity_card_image_back: any;
  tax_code: null | string;
  note: string;
  is_verify: boolean;
  is_default: boolean;
  learning_purpose: string;
  contact_detail: string;
  special_note: string;
  classification: string;
  company_type: null | string;
  company_position: null | string;
  company_rank: null | string;
  settings: null | any;
}
export interface IFacility {
  id: string;
  name: string;
  code: string;
}
export interface UserState {
  loading: boolean;
  loadingEditName: boolean;
  loadingEditAvatar: boolean;
  errors: object;
  user: IUser;
  loginHistory: any;
  loadHistory: boolean;
}

export interface IUniversity {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  code?: string;
  name?: string;
  description?: string;
  score?: number;
  address?: string;
}

export interface IMajor {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  code?: string;
  name?: string;
  score?: number;
  description?: string;
}

export interface ISubjectItem {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  course_category_id?: string;
  name: string;
  code: string;
}

export interface IUserHubspotProgramInfo {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  user_id?: string;
  course_category_id?: string;
  hubspot_account_info?: string;
  course_category?: {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    name?: string;
    description?: string;
  };
}

export interface UserHubspotExaminationSubjectItem {
  id: string;
  examination_subject_id: string;
  result: string;
  examination_subject: {
    id: string;
    subject_id: string;
    examination_id: string;
    subject: ISubjectItem;
    examination: {
      id: string;
      name: string;
    };
  };
  is_final_examination_subject: boolean;
}
export interface ICourseTabGroup {
  id: string;
  user_hubspot_examination_subjects: UserHubspotExaminationSubjectItem[];
}

export interface IExamination {
  id: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
  code_exam?: string;
  start_date?: string;
  end_date?: string;
  examination?: {
    id?: string;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date;
    name?: string;
  };
  subject?: ISubjectItem;
}

export interface IExaminationList {
  examination_subjects: IExamination[];
  metadata: IMetaData;
}

export interface IUserAPI {
  getMe: () => Promise<IUser>;
  getUserInformation: () => Promise<any>;
  updateUser: (
    full_name: string,
    avatar?: {
      [key: string]: string;
    } | null,
  ) => Promise<
    IResponse<{
      message: string;
    }>
  >;
  updateUserAvatar: (avatar: File) => Promise<any>;
  getListDevices: () => Promise<IDeviceItem[]>;
  getListHistory: ({ page_index, page_size, type }: any) => Promise<any>;
  getPinnedNotifications: () => Promise<PinnedNotifications>;
  getUserPrograms?: (course_category_id: string | undefined) => Promise<any>;
  removeDevice: (session_id: string) => Promise<any>;
  getExamination: (
    page_index: number,
    page_size: number,
  ) => Promise<UserExamInformation>;
}
