export const ProfilePages = {
  MyProfile: 'myprofile',
  Certificates: 'certificates',
  Settings: 'settings',
  Logout: 'logout',
  Devices: 'devices',
  LoginHistory: 'login_history',
  ExamInfo: 'exam_information',
  ChangePassword: 'change_password',
  OVERVIEW: 'overview',
  CMA: 'cma',
  CFA: 'cfa',
  ACCA: 'acca',
} as const

export type IProfilePages = (typeof ProfilePages)[keyof typeof ProfilePages]
