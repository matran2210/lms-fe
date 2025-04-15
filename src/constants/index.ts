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
  MYPROFILE: '/overview',
  PAGE_NOT_FOUND: '/404',
  COURSE_DETAIL: '/courses/my-course/[courseId]',
  COURSE_PART_DETAIL: '/courses/[id]/section/[course_section_id]',
  COURSE_ACTIVITY: '/courses/[id]/activity/[activityId]',
  TEST_RESULT: '/courses/test/test-result/[id]',
  USERPAGE: '/[page]',
  EVENT_TEST: '/event-test',
  RESULTS: '/courses/my-course/[courseId]/results',
  COURSE_CONTENT: '/courses/my-course',
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
  EXAM_INFORMATION: 'Exam Information',
  COURSE_CONTENT: 'Course Content',
  NOTES_LIST: 'Notes List',
  NEW_NOTE: 'New Note',
  CALCULATOR: 'Calculator',
  ENTRANCE_TEST: 'Entrance Test',
}

export const GUIDELINE_PASSWORD = [
  'Tối thiểu 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự số',
]

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
export enum TEST_TYPE {
  QUIZ = 'QUIZ',
  MID_TERM_TEST = 'MID_TERM_TEST',
  FINAL_TEST = 'FINAL_TEST',
  MOCK_TEST = 'MOCK_TEST',
  ENTRANCE_TEST = 'ENTRANCE_TEST',
  // STORY = 'STORY',
  TOPIC_TEST = 'TOPIC_TEST',
  CHAPTER_TEST = 'CHAPTER_TEST',
  PART_TEST = 'PART_TEST',
  EVENT_TEST = 'EVENT_TEST',
  ACTIVITY = 'ACTIVITY',
}

export enum COURSE_TYPE {
  FOUNDATION_COURSE = 'FOUNDATION_COURSE',
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

export const defaultStatusEventTest = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Completed',
    value: 'SUBMITTED',
  },
  {
    label: 'Uncompleted',
    value: 'UN_SUBMITTED',
  },
]

export const DEFAULT_SELECT = [{ label: 'All', value: '' }]

export const DEFAULT_SELECT_SECTION = [{ label: 'All Section', value: '' }]

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

export const CLASS_USER_TYPES = {
  NORMAL: 'NORMAL', // Bình thường
  RESERVED: 'RESERVED', // Bảo lưu
  REASSIGNED: 'REASSIGNED', // Học lại vì bảo lưu
  RETOOK: 'RETOOK', // Trượt
  RETAKING: 'RETAKING', // Học lại vì trượt
  MOVED_OUT: 'MOVED_OUT', // Chuyển ra khỏi lớp
  MOVED_IN: 'MOVED_IN', // Chuyển vào lớp
  TRANSFERED_TO: 'TRANSFERED_TO', // Đã chuyển nhượng
  TRANSFERRED: 'BE_TRANSFERRED', // Được chuyển nhượng
  CANCELED: 'CANCELED', // Hủy học
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

export const SOCIAL_LINK = {
  FACEBOOK: 'https://www.facebook.com/sapp.edu.vn',
}

export const ESSAY_TYPE = {
  WORD: 'WORD',
  SHEET: 'SHEET',
}

export const GRADE_STATUS = {
  AWAITING_GRADING: 'AWAITING_GRADING',
  FINISHED_GRADING: 'FINISHED_GRADING',
}

export const GRADING_METHOD = {
  MANUAL: 'MANUAL',
  AUTO: 'AUTO',
}

export const FINISHED_TEST_TITLE = 'Submitted Successfully'

export const COMMON_TEXT_ENUM = {
  SUBMITED: 'SUBMITED',
}

export const CERTIFICATE_DETAIL = '/certificates/[id]'
export const ENTRANCE_TEST_RESULT = '/entrance-test/test-result/[id]'
export const ENTRANCE_TEST_TABLE_RESULT = '/entrance-test/table-result/[id]'

export enum PROGRAM {
  ACCA = 'ACCA',
  CFA = 'CFA',
  CMA = 'CMA',
}

export enum EXHIBIT_TEXT_REPLACE {
  EXHIBIT = 'Exhibit',
  EXHIBIT_REPLACE = 'Time Value Table',
}

export const ERROR_MESSAGE_TRIAL =
  'Sorry, you do not have access to this content'

export enum TEST_ATTEMPT_TYPE {
  MID_TERM_TEST = 'MID_TERM_TEST',
  FINAL_TEST = 'FINAL_TEST',
  MOCK_TEST = 'MOCK_TEST',
  TOPIC_TEST = 'TOPIC_TEST',
  CHAPTER_TEST = 'CHAPTER_TEST',
  ENTRANCE_TEST = 'ENTRANCE_TEST',
}

export * from './socketEvents'
export * from './localStorageKeys'
export * from './form'
