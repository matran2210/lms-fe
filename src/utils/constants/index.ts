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
} as any

// Danh sách F thấp (< F4)
export const F_LOW_CODES = ['F1', 'F2', 'F3', 'F4']
export const F_HIGH_CODES = ['F5', 'F6']

export const video_url = process.env.NEXT_PUBLIC_VIDEO_URL

export const CERTIFICATE_DETAIL = '/certificates/[id]'

export * from './Course'
export * from './LocalStorageKey'
export * from './Test'
