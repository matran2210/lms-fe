import { COURSES_STATUS } from "../enums"

export const COURSES_STATUS_BADGE = {
  [COURSES_STATUS.RECEIVED]: 'active',
  [COURSES_STATUS.PROCESSING]: 'pending',
  [COURSES_STATUS.SUCCESS]: 'approved',
  [COURSES_STATUS.FAILURE]: 'reject',
  [COURSES_STATUS.LEARNING]: 'learning',
  [COURSES_STATUS.FINISH]: 'finished',
} as const

export const COURSES_STATUS_LABEL = {
  [COURSES_STATUS.RECEIVED]: 'Received',
  [COURSES_STATUS.PROCESSING]: 'Processing',
  [COURSES_STATUS.SUCCESS]: 'Success',
  [COURSES_STATUS.FAILURE]: 'Failure',
  [COURSES_STATUS.LEARNING]: 'Learning',
  [COURSES_STATUS.FINISH]: 'Finished',
} as const

export const DEFAULT_TOOLTIP_BG_COLOR = '#ffffff'
export const DEFAULT_TOOLTIP_COLOR = '#000000'

export const ROUTES = {
  SHORT_COURSE: '/short-course',
  MY_COURSES: '/short-course/my-course/',
  COURSE_DETAIL: (id: string) => `/short-course/detail/${id}`,
  ACTIVITY: (
    course_id: string,
    course_section_id: string[] | undefined | string,
  ) => `/short-course/detail/${course_id}/activity/${course_section_id}`,
}

export const DEFAULT_PAGESIZE = 18

export const QUIZ_MODAL_WIDTH = 560
