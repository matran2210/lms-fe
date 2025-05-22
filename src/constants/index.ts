export const PageLink = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_NEW: '/courses/new-courses',
  TOPICS: '/topics',
  CASE_STUDY: '/casestudy',
  TEACHERS: '/teachers',
  STUDENTS: '/students',
  TEACHER_MY_CLASS: '/teachers/my-class',
  TEACHER_MY_REQUEST: '/teachers/my-request',
  TEACHER_CHAPTER_TEST: '/teachers/my-class/chapter-test',
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
  MY_CALENDAR: '/teachers/my-calendar',
  REQUEST: '/request',
  MY_REQUEST: '/teachers/my-request',
  DASHBOARD: '/courses/my-course/[courseId]/dashboard',
  COURSE_CONTENT: '/courses/my-course',
  CALENDAR: '/calendar',
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
  MY_CALENDAR: 'My Calendar',
  MY_REQUEST: 'My Request',
  CALENDAR: 'Calendar',
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
  NORMAL_COURSE = 'NORMAL_COURSE',
  PRACTICE_COURSE = 'PRACTICE_COURSE',
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
export const DEFAULT_PAGE_SIZE = 10
export const DEFAULT_PAGE_NUMBER = 1
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

export const QUIZ_ATTEMPT_STATUS_AUTO = [
  {
    label: 'Unsubmitted',
    value: 'UN_SUBMITTED',
  },
  {
    label: 'Submitted',
    value: 'SUBMITTED',
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

export const SEARCH_EVENT_PLACEHOLDER = 'Event name'

export const PRIMARY_COLOR = '#FFB800'

export const ANT_THEME_CONFIG = {
  token: {
    colorPrimary: PRIMARY_COLOR,
  },
}

export const POPUP_EVENT_DETAILS = {
  TITLE: 'Event name',
  TIME: 'Time',
  TYPE: 'Event type',
  CLASSROOM_NAME: 'Classroom name',
  CLASSROOM_ADDRESS: 'Classroom address',
  MEETING_LINK: 'Meeting link',
  DESCRIPTION: 'Description',
}

export const CALENDAR_SIDEBAR_TITLE = 'Add Busy Schedule'

export const CALENDAR_SIDEBAR_EVENT_FORM = {
  EVENT_NAME: 'Event name',
  EVENT_TIME: 'Start Time - end time',
  REPEAT: 'Repeat',
  DESCRIPTION: 'Description',
}

export const EVENT_TYPES = {
  TEACHING: 'TEACHING',
  BUSY: 'BUSY',
  HOLIDAY: 'HOLIDAY',
  OTHER: 'OTHER',
  LIVE_ONLINE: 'LIVE_ONLINE',
} as const

export const EVENT_TYPES_RESPONSE = {
  TEACHING: 'TEACHING',
  BUSY: 'BUSY',
  HOLIDAY: 'HOLIDAY',
  OTHER: 'OTHER',
  LIVE_ONLINE: 'LIVE_ONLINE',
} as const

export const EVENT_TYPES_ARRAY = Object.values(EVENT_TYPES)

export const EVENT_TYPES_LABEL = {
  [EVENT_TYPES.TEACHING]: 'Teaching schedule',
  [EVENT_TYPES.BUSY]: 'Busy schedule',
  [EVENT_TYPES.HOLIDAY]: 'Holiday schedule',
  [EVENT_TYPES.OTHER]: 'Other calendar',
  [EVENT_TYPES.LIVE_ONLINE]: '',
}

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPES_LABEL)
  .filter(([key, label]) => key !== EVENT_TYPES.LIVE_ONLINE)
  .map(([key, value]) => ({ value: key, label: value }))

export const EVENT_REPEAT_TYPES = {
  NO_REPEAT: 'NO_REPEAT',
  DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  ANNUALLY: 'ANNUALLY',
  EVERY_WEEKDAY: 'EVERY_WEEKDAY',
  CUSTOM: 'CUSTOM',
  CHOSEN_PATTERN: 'CHOSEN_PATTERN',
}
export const EVENT_REPEAT_LABEL = {
  [EVENT_REPEAT_TYPES.NO_REPEAT]: 'Does not repeat',
  [EVENT_REPEAT_TYPES.DAILY]: 'Daily',
  [EVENT_REPEAT_TYPES.EVERY_WEEKDAY]: 'Every weekday (Monday to Friday)',
  [EVENT_REPEAT_TYPES.CUSTOM]: 'Custom',
}

export enum FREQUENCY_UNITS {
  DAY = 'days',
  WEEK = 'weeks',
  MONTH = 'months',
  YEAR = 'years',
}

enum FREQUENCY_UNITS_LABEL {
  days = 'Day',
  weeks = 'Week',
  months = 'Month',
  years = 'Year',
}

enum FREQUENCY_UNITS_LABEL_PLURAL {
  days = 'Days',
  weeks = 'Weeks',
  months = 'Months',
  years = 'Years',
}

export const FREQUENCY_UNITS_OBJECT = {
  [FREQUENCY_UNITS.DAY]: {
    label: FREQUENCY_UNITS.DAY,
    max: 365,
  },
  [FREQUENCY_UNITS.WEEK]: {
    label: FREQUENCY_UNITS.WEEK,
    max: 52,
  },
  [FREQUENCY_UNITS.MONTH]: {
    label: FREQUENCY_UNITS.MONTH,
    max: 12,
  },
  [FREQUENCY_UNITS.YEAR]: {
    label: FREQUENCY_UNITS.YEAR,
    max: 1,
  },
} as const

export const FREQUENCY_OPTIONS = Object.entries(FREQUENCY_UNITS).map(
  ([key, value]) => ({ value: value, label: FREQUENCY_UNITS_LABEL[value] }),
)

export const FREQUENCY_OPTIONS_PLURAL = Object.entries(FREQUENCY_UNITS).map(
  ([key, value]) => ({
    value: value,
    label: FREQUENCY_UNITS_LABEL_PLURAL[value],
  }),
)

export const FREQUENCY_UNITS_LIMIT = {
  MIN: 1,
  MAX: {
    [FREQUENCY_UNITS.DAY]: 365,
    [FREQUENCY_UNITS.WEEK]: 52,
    [FREQUENCY_UNITS.MONTH]: 12,
    [FREQUENCY_UNITS.YEAR]: 1,
  },
} as const

export const REPEAT_ON = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] as const

export const REPEAT_ON_MAPPED = [
  'CN',
  'T2',
  'T3',
  'T4',
  'T5',
  'T6',
  'T7',
] as const

export const REPEAT_ON_MAPPED_PAYLOAD = {
  T2: 1,
  T3: 2,
  T4: 3,
  T5: 4,
  T6: 5,
  T7: 6,
  CN: 7,
} as const

export const CONFIRM_CANCEL = 'Are you sure you want to cancel?'
export const CONFIRM_DELETE = 'Are you sure you want to delete?'

export const CALENDAR_SIDEBAR_SAVE_BUTTON = 'Save'
export const CALENDAR_SIDEBAR_CANCEL_BUTTON = 'Cancel'

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
export enum CALENDAR_COLOR_TYPES {
  BLUE_COLOR = 'TEACHING', // màu xanh dương
  RED_COLOR = 'BUSY', // màu đỏ
  YELLOW_COLOR = 'HOLIDAY', // màu vàng
  GREEN_COLOR = 'OTHER', // màu xanh lá
  PURPLE_COLOR = 'LIVE_ONLINE', // màu xanh lá
}

export enum CALENDAR_FILTER_TYPE {
  HOLIDAY = 'HOLIDAY',
  OVERDUE = 'OVERDUE',
  ONLINE = 'ONLINE',
  LIVE_ONLINE = 'LIVE_ONLINE',
  OFFLINE = 'OFFLINE',
  CASE_STUDY = 'CASE_STUDY',
  KEY_BEFORE_CONTENT = 'KEY_BEFORE_CONTENT',
  TEST = 'TEST',
}

export const CALENDAR_FILTER_TYPE_LABEL = {
  [CALENDAR_FILTER_TYPE.HOLIDAY]: 'Holiday',
  [CALENDAR_FILTER_TYPE.OVERDUE]: 'Overdue',
  [CALENDAR_FILTER_TYPE.ONLINE]: 'Online',
  [CALENDAR_FILTER_TYPE.LIVE_ONLINE]: 'Live Online',
  [CALENDAR_FILTER_TYPE.OFFLINE]: 'Offline',
  [CALENDAR_FILTER_TYPE.CASE_STUDY]: 'Case Study',
  [CALENDAR_FILTER_TYPE.KEY_BEFORE_CONTENT]: 'Key Before Content',
  [CALENDAR_FILTER_TYPE.TEST]: 'Test',
}

export const LEARNING_USER_STATUS = {
  READY_TO_LEARN: 'READY_TO_LEARN', // Chưa học
  IN_PROGRESS: 'IN_PROGRESS', // Đang học
  COMPLETED: 'COMPLETED', // Đã học xong
}

export const CALENDAR_TYPE = {
  LMS: 'LMS',
  OPS: 'OPS',
}

export const PDF_VIEWER_URL = 'https://mozilla.github.io/pdf.js/web/viewer.html'
export const OFFICE_VIEWER_URL =
  'https://view.officeapps.live.com/op/embed.aspx'

export * from './common'
export enum QUIZ_ATTEMPT_STATUS {
  SUBMITTED = 'SUBMITTED',
  UN_SUBMITTED = 'UN_SUBMITTED',
  IN_PROGRESS = 'IN_PROGRESS',
}
export enum DATE_FORMAT {
  DATE_TIME = 'HH:mm | DD/MM/YYYY',
  DATE_TIME_DASH = 'HH:mm - DD/MM/YYYY',
  DATE = 'DD/MM/YYYY',
}

export const LABEL_MAX_LENGTH = 12

export * from './socketEvents'
export * from './localStorageKeys'
export * from './request'
export * from './socketEvents'
