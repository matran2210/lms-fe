export interface IUser {
  id: string
  created_at: string
  updated_at: string
  deleted_at: null | string
  key: string
  invite_id: null | string
  code: null | string
  username: string
  nick_name: null | string
  type: IUserType
  status: IUserStatus
  ekyc_status: null | string
  approved_date: null | string
  reject_reason: null | string
  confirmation_status: null | string
  detail_id: string
  detail: IUserDetail
  user_contacts: IUserContact[]
  certificates: number
  courses: number
  university?: any
  university_program?: any
  major?: any
  english_level?: any
  pinnedNotifications?: any
}
interface IUserContact {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string
  is_default: boolean
  email: string
  phone: string
  country_code: string
  provinceCode: string
  districtCode: string
  wardCode: string
  address: string
  permanent_address: string
  company_type: string
  company_position: string
  company_rank: string
  province: string
  district: string
  ward: string
}

export enum IUserType {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
}
export enum IUserStatus {
  ACTIVE = 'ACTIVE',
}
interface IUserDetail {
  id: string
  created_at: string
  updated_at: string
  deleted_at: null | string
  country_code: null | string
  email: string
  phone: string
  firstName: null | string
  lastName: null | string
  full_name: string
  address: string
  major: string
  level: string
  university: string
  provinceCode: null | string
  districtCode: null | string
  wardCode: null | string
  dob: null | string
  avatar: { [key: string]: string }
  sex: string
  permanent_address: null | string
  identity_card: null | string
  date_of_issue: null | string
  place_of_issue: null | string
  identity_card_image_front: any
  identity_card_image_back: any
  tax_code: null | string
  note: string
  is_verify: boolean
  is_default: boolean
  learning_purpose: string
  contact_detail: string
  special_note: string
  classification: string
  company_type: null | string
  company_position: null | string
  company_rank: null | string
  settings: null | any
}

export interface UserState {
  loading: boolean
  loadingEditName: boolean
  loadingEditAvatar: boolean
  errors: object
  user: IUser
  loginHistory: any
  loadHistory: boolean
}
