export const PageLink = {
  DASHBOARD: '/',
  COURSES: '/courses',
  COURSE_NEW: '/courses/new-courses',
  TOPICS: '/topics',
  CASE_STUDY: '/casestudy',
  TEACHER: '/teacher',
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_FORGOT_PASSWORD_RECOVER: '/auth/forgot-password/recover',
  AUTH_CHANGE_PASSWORD: '/auth/change-password',
  AUTH_CHANGE_PASSWORD_SUCCESS: '/auth/change-password/change-password-success',
  NOTIFICATION: '/notifications',
}

export const TitleSidebar = {
  DASHBOARD: 'Dashboard',
  COURSES: 'Courses',
  COURSE_NEW: 'Course new',
  COURSE_LIST: 'Course list',
  CASE_STUDY: 'Case Study',
  TOPICS: 'Topics',
  TOPICS_LIST: 'Topics list',
  TEACHER: 'Teacher',
}

export const GUIDELINE_PASSWORD = [
  'Tối thiểu 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự số',
]

export const PUBLIC_PATHS: { [key: string]: boolean } = {
  [PageLink.AUTH_LOGIN]: true,
  [PageLink.AUTH_FORGOT_PASSWORD]: true,
  [PageLink.AUTH_FORGOT_PASSWORD_RECOVER]: true,
}
export enum QUESTION_TYPES {
  TRUE_FALSE = 'TRUE_FALSE',
  ONE_CHOICE = 'ONE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  MATCHING = 'MATCHING',
  SELECT_WORD = 'SELECT_WORD',
  FILL_WORD = 'FILL_WORD',
  DRAG_DROP = 'DRAG_DROP',
  ESSAY = 'ESSAY',
}
export enum DISPLAY_TYPE {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL',
}
export enum RESPONSE_OPTION {
  WORD = 'WORD',
  SHEET = 'SHEET',
}
export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024
export const MAX_UPLOAD_VIDEO_SIZE = 20 * 1024 * 1024 * 1024
export const VALID_UPLOAD_EDITOR = [
  { type: 'image/*', size: MAX_UPLOAD_SIZE },
  { type: 'video/*', size: MAX_UPLOAD_VIDEO_SIZE },
]
