import {
  CALENDAR_FILTER_TYPE,
  FREQUENCY_UNITS,
  FREQUENCY_UNITS_LABEL,
  FREQUENCY_UNITS_LABEL_PLURAL,
} from "../enums";
import { ISelectOption } from "../types/courses";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
export const { apiURL } = publicRuntimeConfig;
export const TitleSidebar = {
  DASHBOARD: "Dashboard",
  COURSES: "My Course",
  RESOURCES: "Resources",
  COURSE_NEW: "Course new",
  COURSE_LIST: "Course list",
  CASE_STUDY: "Case Study",
  TOPICS: "Topics",
  TOPICS_LIST: "Topics list",
  TEACHER: "Teacher",
  NOTIFICATION: "Notifications",
  RESULTS: "Test / Quiz List",
  EXAM_INFORMATION: "Exam Information",
  EXAM_LIST: "Exam List",
  COURSE_CONTENT: "Course Content",
  NOTES_LIST: "Notes List",
  NEW_NOTE: "New Note",
  ADD_NOTE: "Add Note",
  CALCULATOR: "Calculator",
  ENTRANCE_TEST: "Entrance Test",
  MY_CALENDAR: "My Calendar",
  MY_REQUEST: "My Request",
  CALENDAR: "Calendar",
  EXAM: "Exam",
  COURSE_RESOURCES: "Course Resource",
  STUDENT_CALENDAR: "Student Calendar",
  LEARNING_ACTIVITY: "Learning Activity",
  TEST: "Test",
  DASHBOARD_TEST: "Dashboard Test",
  HOME: "Home",
  STUDENT_PROFILE: "Student Profile",
  ACTIVITY: "Activity",
};

export const ValueSidebar = {
  HOME: "home",
  DASHBOARD: "dashboard",
  COURSES: "my-course",
  STUDENT_CALENDAR: "student-calendar",
  LEARNING_ACTIVITY: "learning-activity",
  TEST: "test",
  DASHBOARD_TEST: "dashboard-test",
  EXAM_LIST: "exam-list",
  STUDENT_PROFILE: "student-profile",
};

export const TitleTeacherSidebar = {
  DASHBOARD: "Dashboard",
  MYCLASS: "My Class",
  MYCALENDAR: "My Calendar",
  MYREQUEST: "My Request",
  NOTIFICATIONS: "Notifications",
};

export const GUIDELINE_PASSWORD = [
  "Tối thiểu 8 ký tự, ít nhất 1 ký tự hoa, 1 ký tự số",
];

export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;
export const MAX_UPLOAD_VIDEO_SIZE = 20 * 1024 * 1024 * 1024;
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE_NUMBER = 1;
export const VALID_UPLOAD_EDITOR = [
  { type: "image/*", size: MAX_UPLOAD_SIZE },
  { type: "video/*", size: MAX_UPLOAD_VIDEO_SIZE },
];

export const UserGuide = {
  TITLE_WELCOME: "Welcome to SAPP LMS",
  CONTENT_WELCOME: "Let’s start with a quick product tour!",
  CONTENT_BUTTON: "Start Tour",
  CONTENT_STEP_1:
    "The search box is located in the upper corner of the website. Simply enter the course name and press Enter to search.",
  CONTENT_STEP_2:
    "The left menu bar is divided into two sections. The upper section consists of the SAPP logo, dashboard, your enrolled courses, and the entrance test you have registered for.",
  CONTENT_STEP_3:
    "The lower section of the menu consists of notifications and your profile, which includes personal information, certificates, settings, and the option to log out.",
  CONTENT_STEP_4:
    "This is the welcome section! You will find information about your location here, and take a moment to familiarize yourself with the features and possibilities that await you on this page.",
  CONTENT_STEP_5:
    "This is a course you have enrolled in. It provides details about the class it belongs to, the remaining study days, a brief course description, as well as the status and progress you have made so far.",
  CONTENT_STEP_6:
    "This is a course you have enrolled in. It provides details about the class it belongs to, the remaining study days, a brief course description, as well as the status and progress you have made so far.",
};

export const defaultStatusCourse = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Ready To Learn",
    value: "READY_TO_LEARN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
  {
    label: "Expired",
    value: "CANCELED",
  },
];

export const defaultStatusDetail = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Ready To Learn",
    value: "READY_TO_LEARN",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
  {
    label: "Completed",
    value: "COMPLETED",
  },
];

export const defaultStatusEnstraceTest = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Submitted",
    value: "SUBMITTED",
  },
  {
    label: "Not started",
    value: "NOT_STARTED",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
];

export const defaultStatusEventTest = [
  {
    label: "All",
    value: "",
  },
  {
    label: "Submitted",
    value: "SUBMITTED",
  },
  {
    label: "Not started",
    value: "NOT_STARTED",
  },
  {
    label: "In Progress",
    value: "IN_PROGRESS",
  },
];

export const QUIZ_ATTEMPT_STATUS_AUTO = [
  {
    label: "Unsubmitted",
    value: "UN_SUBMITTED",
  },
  {
    label: "Submitted",
    value: "SUBMITTED",
  },
];

export const DEFAULT_SELECT = [{ label: "All", value: "" }];

export const DEFAULT_SELECT_SECTION_NAME = "All Section";

export const DEFAULT_SELECT_SECTION: ISelectOption[] = [
  {
    label: "All Section",
    value: "",
    name: DEFAULT_SELECT_SECTION_NAME,
  },
];

export const COURSE_STATUS = {
  PUBLISH: "PUBLISH",
  LOCK: "LOCK",
  DRAFT: "DRAFT",
  BLOCK: "BLOCK",
};

export const CLASS_STATUS = {
  PUBLIC: "PUBLIC",
  DRAFT: "DRAFT",
  BLOCK: "BLOCK",
  ENDED: "ENDED",
};

export const CLASS_USER_TYPES = {
  NORMAL: "NORMAL", // Bình thường
  RESERVED: "RESERVED", // Bảo lưu
  REASSIGNED: "REASSIGNED", // Học lại vì bảo lưu
  RETOOK: "RETOOK", // Trượt
  RETAKING: "RETAKING", // Học lại vì trượt
  MOVED_OUT: "MOVED_OUT", // Chuyển ra khỏi lớp
  MOVED_IN: "MOVED_IN", // Chuyển vào lớp
  TRANSFERED_TO: "TRANSFERED_TO", // Đã chuyển nhượng
  TRANSFERRED: "BE_TRANSFERRED", // Được chuyển nhượng
  CANCELED: "CANCELED", // Hủy học
};

export const BUTTON_STATUS = {
  Active: "Active",
  Begin: "Begin",
  Resume: "Resume",
  Review: "Review",
  Extend: "Extend",
  Hidden: "Hidden",
  Disabled: "Disabled",
};

export const ANIMATION = {
  DURATION: 500,
  DATA_AOS: "fade-up",
};

export const SOCIAL_LINK = {
  FACEBOOK: "https://www.facebook.com/sapp.edu.vn",
};

export const ESSAY_TYPE = {
  WORD: "WORD",
  SHEET: "SHEET",
};

export const GRADE_STATUS = {
  IN_REVIEW: "IN_REVIEW",
  AWAITING_GRADING: "AWAITING_GRADING",
  FINISHED_GRADING: "FINISHED_GRADING",
  REGRADING: "REGRADING",
};

export const GRADING_METHOD = {
  MANUAL: "MANUAL",
  AUTO: "AUTO",
};

export const FINISHED_TEST_TITLE = "Submitted Successfully";

export const COMMON_TEXT_ENUM = {
  SUBMITED: "SUBMITED",
};

export const CERTIFICATE_DETAIL = "/certificates/[id]";
export const ENTRANCE_TEST_RESULT = "/entrance-test/test-result/[id]";
export const ENTRANCE_TEST_TABLE_RESULT = "/entrance-test/table-result/[id]";

export const SEARCH_EVENT_PLACEHOLDER = "Event name";

export const PRIMARY_COLOR = "#FFB800";

export const ANT_THEME_CONFIG = {
  token: {
    colorPrimary: PRIMARY_COLOR,
  },
};

export const POPUP_EVENT_DETAILS = {
  TITLE: "Event name",
  TIME: "Time",
  TYPE: "Event type",
  REPEAT: "Repeat",
  CLASSROOM_NAME: "Classroom name",
  CLASSROOM_ADDRESS: "Classroom address",
  MEETING_LINK: "Meeting link",
  DESCRIPTION: "Description",
};

export const CALENDAR_SIDEBAR_TITLE = "Add Busy Schedule";

export const CALENDAR_SIDEBAR_EVENT_FORM = {
  EVENT_NAME: "Event name",
  EVENT_TIME: "Start Time - end time",
  REPEAT: "Repeat",
  DESCRIPTION: "Description",
};

export const EVENT_TYPES = {
  TEACHING: "TEACHING",
  BUSY: "BUSY",
  HOLIDAY: "HOLIDAY",
  OTHER: "OTHER",
  LIVE_ONLINE: "LIVE_ONLINE",
  INACTIVE: "INACTIVE",
} as const;

export const EVENT_TYPES_RESPONSE = {
  TEACHING: "TEACHING",
  BUSY: "BUSY",
  HOLIDAY: "HOLIDAY",
  OTHER: "OTHER",
  LIVE_ONLINE: "LIVE_ONLINE",
  INACTIVE: "INACTIVE",
} as const;

export const EVENT_TYPES_ARRAY = Object.values(EVENT_TYPES);

export const EVENT_TYPES_LABEL = {
  [EVENT_TYPES.TEACHING]: "Teaching schedule",
  [EVENT_TYPES.BUSY]: "Busy schedule",
  [EVENT_TYPES.HOLIDAY]: "Holiday schedule",
  [EVENT_TYPES.OTHER]: "Other calendar",
  [EVENT_TYPES.LIVE_ONLINE]: "",
  [EVENT_TYPES.INACTIVE]: "Inactive",
};

export const EVENT_TYPE_OPTIONS = Object.entries(EVENT_TYPES_LABEL)
  .filter(([key, label]) => key !== EVENT_TYPES.LIVE_ONLINE)
  .map(([key, value]) => ({ value: key, label: value }));

export const EVENT_REPEAT_TYPES = {
  NO_REPEAT: "NO_REPEAT",
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  ANNUALLY: "ANNUALLY",
  EVERY_WEEKDAY: "EVERY_WEEKDAY",
  CUSTOM: "CUSTOM",
  CHOSEN_PATTERN: "CHOSEN_PATTERN",
};
export const EVENT_REPEAT_LABEL = {
  [EVENT_REPEAT_TYPES.NO_REPEAT]: "Does not repeat",
  [EVENT_REPEAT_TYPES.DAILY]: "Daily",
  [EVENT_REPEAT_TYPES.EVERY_WEEKDAY]: "Every weekday (Monday to Friday)",
  [EVENT_REPEAT_TYPES.CUSTOM]: "Custom",
  [EVENT_REPEAT_TYPES.WEEKLY]: "Weekly",
  [EVENT_REPEAT_TYPES.MONTHLY]: "Monthly",
  [EVENT_REPEAT_TYPES.ANNUALLY]: "Annually",
};

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
} as const;

export const FREQUENCY_OPTIONS = Object.entries(FREQUENCY_UNITS).map(
  ([key, value]) => ({ value: value, label: FREQUENCY_UNITS_LABEL[value] }),
);

export const FREQUENCY_OPTIONS_PLURAL = Object.entries(FREQUENCY_UNITS).map(
  ([key, value]) => ({
    value: value,
    label: FREQUENCY_UNITS_LABEL_PLURAL[value],
  }),
);

export const FREQUENCY_UNITS_LIMIT = {
  MIN: 1,
  MAX: {
    [FREQUENCY_UNITS.DAY]: 365,
    [FREQUENCY_UNITS.WEEK]: 52,
    [FREQUENCY_UNITS.MONTH]: 12,
    [FREQUENCY_UNITS.YEAR]: 1,
  },
} as const;

export const REPEAT_ON = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export const REPEAT_ON_MAPPED = [
  "CN",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
] as const;

export const REPEAT_ON_MAPPED_PAYLOAD = {
  T2: 0,
  T3: 1,
  T4: 2,
  T5: 3,
  T6: 4,
  T7: 5,
  CN: 6,
} as const;

export const CONFIRM_CANCEL = "Are you sure you want to cancel?";
export const CONFIRM_DELETE = "Are you sure you want to delete?";

export const CALENDAR_SIDEBAR_SAVE_BUTTON = "Save";
export const CALENDAR_SIDEBAR_CANCEL_BUTTON = "Cancel";

export const ERROR_MESSAGE_TRIAL =
  "Sorry, you do not have access to this content";

export const CALENDAR_FILTER_TYPE_LABEL = {
  [CALENDAR_FILTER_TYPE.HOLIDAY]: "Holiday",
  [CALENDAR_FILTER_TYPE.OVERDUE]: "Overdue",
  [CALENDAR_FILTER_TYPE.ONLINE]: "Online",
  [CALENDAR_FILTER_TYPE.LIVE_ONLINE]: "Live Online",
  [CALENDAR_FILTER_TYPE.OFFLINE]: "Offline",
  [CALENDAR_FILTER_TYPE.CASE_STUDY]: "Case Study",
  [CALENDAR_FILTER_TYPE.KEY_BEFORE_CONTENT]: "Key Before Content",
  [CALENDAR_FILTER_TYPE.TEST]: "Test",
};

export const LEARNING_USER_STATUS = {
  READY_TO_LEARN: "READY_TO_LEARN", // Chưa học
  IN_PROGRESS: "IN_PROGRESS", // Đang học
  COMPLETED: "COMPLETED", // Đã học xong
};

export const CALENDAR_TYPE = {
  LMS: "LMS",
  OPS: "OPS",
};

export const PDF_VIEWER_URL =
  "https://mozilla.github.io/pdf.js/web/viewer.html";
export const OFFICE_VIEWER_URL =
  "https://view.officeapps.live.com/op/embed.aspx";

export * from "./common";

export const COOKIE_INFO = {
  SESSION_ID: "sessionId",
  KEYCLOAK_USER_ID: "keycloakUserId",
  KEYCLOAK_TOKEN: "keycloakToken",
  KEYCLOAK_REFRESH_TOKEN: "keycloakRefreshToken",
};

export const statusMap = {
  COMPLETED: {
    label: "Completed",
    color: "text-green-1",
    bg: "bg-green-2",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "text-blue-3",
    bg: "bg-blue-4",
  },
  NOT_STARTED: {
    label: "Not Started",
    color: "text-primary-4",
    bg: "bg-primary-5",
  },
  ended: { label: "Ended", color: "text-gray-600", bg: "bg-gray-100" },
};

export const LABEL_MAX_LENGTH = 12;

export const DELAY_TIME_DISPLAY_POPUP = 2000; // 2s
export const CLASS_TYPE = {
  TRIAL: "TRIAL",
};
export const TEST_AND_QUIZ_TITLE = "Test & Quiz";
export const LAYOUT = {
  DEFAULT_LAYOUT: "DEFAULT_LAYOUT",
  ERROR_LAYOUT: "ERROR_LAYOUT",
  SINGLE_DIALOG_LAYOUT: "SINGLE_DIALOG_LAYOUT",
  FULLSCREEN_LAYOUT: "FULLSCREEN_LAYOUT",
  SINGLE_PAGE_LAYOUT: "SINGLE_PAGE_LAYOUT",
};

export const QUIZ_GRADING_METHOD = [
  {
    label: "Yes",
    value: "MANUAL",
  },
  {
    label: "No",
    value: "AUTO",
  },
];
export const FOUNDATION = "Foundation";
export const CLASS_TEACHER_STATUS = {
  NOT_STARTED: "NOT_STARTED", // Chưa học
  IN_PROGRESS: "IN_PROGRESS", // Đang học
  COMPLETED: "COMPLETED", // Đã học xong
};
export const FLEXIBLE = "FLEXIBLE";
// Danh sách F thấp (< F4)
export const F_LOW_CODES = ["F1", "F2", "F3", "F4"];
export const F_HIGH_CODES = ["F5", "F6"];

export const video_url = process.env.NEXT_PUBLIC_VIDEO_URL;
export const excludedPathsHelp = [
  "/test/[id]",
  "/case-study/[id]",
  "/certificates/[id]",
  "/case-study/result/[id]",
  "/teachers",
  "/courses/[id]/activity/[activityId]",
];
export const CERTIFICATE = "certificates";

export const TEST_TYPE_LABELS = {
  QUIZ: "Quiz",
  MID_TERM_TEST: "Midterm Test",
  FINAL_TEST: "Final Test",
  MOCK_TEST: "Mock Test",
  ENTRANCE_TEST: "Entrance Test",
  // STORY = 'STORY',
  TOPIC_TEST: "Part/Topic Test",
  CHAPTER_TEST: "Chapter/Module Test",
  ACTIVITY: "Quiz",
} as any;

export * from "./localStorageKeys";
export * from "./upload";
export * from "./repeat/index";
export * from "./Progress";
export * from "./User";
export * from "./ValidateRegex";
export * from "./activity";
export * from "./attempt";
export * from "./common";
export * from "./courses";
export * from "./grade";
export * from "./lang";
export * from "./localStorageKeys";
export * from "./my-request";
export * from "./request";
export * from "./upload";
export * from "./form";
export * from "./test";
export * from "./sidebar";
export * from "./queryKey"
export * from './exception-errors/index'