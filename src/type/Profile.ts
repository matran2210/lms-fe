export const ProfilePages = {
  MyProfile: 'myprofile',
  Certificates: 'certificates',
  Settings: 'settings',
  Logout: 'logout',
  Devices: 'devices',
  LoginHistory: 'login_history',
  ExamInfo: 'exam_info',
  ChangePassword: 'change_password',
} as const

export type IProfilePages = (typeof ProfilePages)[keyof typeof ProfilePages]
