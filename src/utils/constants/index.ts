export const LAYOUT = {
  DEFAULT_LAYOUT: 'DEFAULT_LAYOUT',
  ERROR_LAYOUT: 'ERROR_LAYOUT',
  SINGLE_DIALOG_LAYOUT: 'SINGLE_DIALOG_LAYOUT',
  FULLSCREEN_LAYOUT: 'FULLSCREEN_LAYOUT',
  SINGLE_PAGE_LAYOUT: 'SINGLE_PAGE_LAYOUT',
}
export const TEST_TYPE = {
  QUIZ: 'Quiz',
  MID_TERM_TEST: 'Midterm Test',
  FINAL_TEST: 'Final Test',
  MOCK_TEST: 'Mock Test',
  ENTRANCE_TEST: 'Entrance Test',
  // STORY = 'STORY',
  TOPIC_TEST: 'Part/Topic Test',
  CHAPTER_TEST: 'Chapter/Module Test',
  ACTIVITY: 'Quiz',
} as any

export enum TEST_TYPE_ENUM {
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
export const QUIZ_GRADING_METHOD = [
  {
    label: 'Yes',
    value: 'MANUAL',
  },
  {
    label: 'No',
    value: 'AUTO',
  },
]
export const FOUNDATION = 'Foundation'
export const CLASS_TEACHER_STATUS = {
  NOT_STARTED: 'NOT_STARTED', // Chưa học
  IN_PROGRESS: 'IN_PROGRESS', // Đang học
  COMPLETED: 'COMPLETED', // Đã học xong
}
// Danh sách F thấp (< F4)
export const F_LOW_CODES = ['F1', 'F2', 'F3', 'F4']
export const F_HIGH_CODES = ['F5', 'F6']

export const video_url = process.env.NEXT_PUBLIC_VIDEO_URL

export const CERTIFICATE_DETAIL = '/certificates/[id]'
export const CERTIFICATE = 'certificates'

export * from './Course'
export * from './LocalStorageKey'
export * from './Test'
