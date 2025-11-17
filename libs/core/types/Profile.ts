export const ProfilePages = {
  MyProfile: 'myprofile',
  Certificates: 'certificates',
  Settings: 'settings',
  Logout: 'logout',
  Devices: 'devices',
  LoginHistory: 'login_history',
  ExamInformation: 'exam_information',
  ChangePassword: 'change_password',
  OVERVIEW: 'overview',
  STUDENTS: 'students',
  TEACHING_PROGRESS: 'teaching_progress',
  STUDENTS_TEST_RESULT: 'students_test_result',
  CMA: 'cma',
  CFA: 'cfa',
  ACCA: 'acca',
} as const

export type IProfilePages = (typeof ProfilePages)[keyof typeof ProfilePages]
export interface IDeviceItem {
  id: string
  created_at: string
  updated_at: string
  ip: string
  location: string
  user_agent: UserAgent
  user_id: string
  is_current: boolean
}
export interface UserAgent {
  browserName: string
  browserVersion: string
  osName: string
  osVersion: string
  deviceType: string
}
