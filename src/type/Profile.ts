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
