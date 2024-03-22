export const PageLink = {
  DASHBOARD: '/dashboard',
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
  ENTRANCE_TEST: '/entrance-test',
  MYPROFILE: '/myprofile',
}

export const TitleSidebar = {
  DASHBOARD: 'Dashboard',
  COURSES: 'My Course',
  RESOURCES: 'Resources',
  COURSE_NEW: 'Course new',
  COURSE_LIST: 'Course list',
  CASE_STUDY: 'Case Study',
  TOPICS: 'Topics',
  TOPICS_LIST: 'Topics list',
  TEACHER: 'Teacher',
  NOTIFICATION: 'Notifications',
  RESULTS: 'Results',
  NOTES_LIST: 'Notes List',
  NEW_NOTE: 'New Note',
  CALCULATOR: 'Calculator',
  ENTRANCE_TEST: 'Entrance Test',
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

export const UserGuide = {
  TITLE_WELCOME: 'Welcome to SAPP LMS',
  CONTENT_WELCOME: 'Let’s start with a quick product tour!',
  CONTENT_BUTTON: 'Start Tour',
  CONTENT_STEP_1:
    'The search box is located in the upper corner of the website. Simply enter the course name and press Enter to search.',
  CONTENT_STEP_2:
    'The left menu bar is divided into two sections. The upper section consists of the SAPP logo, dashboard, your enrolled courses, and the entrance test you have registered for.',
  CONTENT_STEP_3:
    'The lower section of the menu consists of notifications and your profile, which includes personal information, certificates, settings, and the option to log out.',
  CONTENT_STEP_4:
    'This is the welcome section! You will find information about your location here, and take a moment to familiarize yourself with the features and possibilities that await you on this page.',
  CONTENT_STEP_5:
    'This is a course you have enrolled in. It provides details about the class it belongs to, the remaining study days, a brief course description, as well as the status and progress you have made so far.',
  CONTENT_STEP_6:
    'The filter section allows you to filter courses by curriculum and course status.',
}

export const defaultStatusCourse = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Ready To Learn',
    value: 'READY_TO_LEARN',
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS',
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
  },
  {
    label: 'Expired',
    value: 'CANCELED',
  },
]

export const defaultStatusDetail = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Ready To Learn',
    value: 'READY_TO_LEARN',
  },
  {
    label: 'In Progress',
    value: 'IN_PROGRESS',
  },
  {
    label: 'Completed',
    value: 'COMPLETED',
  },
]

export const defaultStatusEnstraceTest = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Submitted',
    value: 'SUBMITTED',
  },
  {
    label: 'Unsubmitted',
    value: 'UN_SUBMITTED',
  },
]

export const DEFAULT_SELECT = [{ label: 'All', value: '' }]

export const DEFAULT_SELECT_SECTION = [{ label: 'All Section', value: '' }]

export const TITLE_USER_STATUS = {
  NORMAL: 'NORMAL',
  RESERVED: 'RESERVED',
  MOVED_OUT: 'MOVED_OUT',
  MOVED_IN: 'MOVED_IN',
  TRANSFER_TO: 'TRANSFER_TO',
  TRANSFERRED: 'TRANSFERRED',
  CANCELED: 'CANCELED',
}
export const COURSE_STATUS = {
  PUBLISH: 'PUBLISH',
  LOCK: 'LOCK',
  DRAFT: 'DRAFT',
  BLOCK: 'BLOCK',
}

export const CLASS_STATUS = {
  PUBLIC: 'PUBLIC',
  DRAFT: 'DRAFT',
  BLOCK: 'BLOCK',
  ENDED: 'ENDED',
}

export const BUTTON_STATUS = {
  Active: 'Active',
  Begin: 'Begin',
  Resume: 'Resume',
  Review: 'Review',
  Extend: 'Extend',
  Hidden: 'Hidden',
  Disabled: 'Disabled',
}

export const ANIMATION = {
  DURATION: 500,
  DATA_AOS: 'fade-up',
}
