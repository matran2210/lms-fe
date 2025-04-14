import { ISelect } from 'src/type/course'

export enum DRAWER_REQUEST_TYPE {
  PERSONAL_SCHEDULE = 'PERSONAL_SCHEDULE',
  TIMEOFF = 'TIMEOFF',
}
export enum REQUEST_TYPE {
  TEACHING_MODE = 'TEACHING_MODE',
  TEACHER_SCHEDULE_BUSY = 'TEACHER_SCHEDULE_BUSY',
  TEACHER_SCHEDULE_TIME_OFF = 'TEACHER_SCHEDULE_TIME_OFF',
  TEACHER_OTHER = 'TEACHER_OTHER',
  TEACHER_WEEKLY_NORMS = 'TEACHER_WEEKLY_NORMS',
}

export enum REQUEST_STATUS {
  PENDING = 'PENDING',
  REJECT = 'REJECT',
  CANCEL = 'CANCEL',
  APPROVED = 'APPROVED',
}

export const requestStatusToTitle = {
  [REQUEST_STATUS.APPROVED]: 'Approved',
  [REQUEST_STATUS.PENDING]: 'Pending',
  [REQUEST_STATUS.REJECT]: 'Rejected',
  [REQUEST_STATUS.CANCEL]: 'Canceled',
} as const

export const requestTypeToTitle = {
  [REQUEST_TYPE.TEACHING_MODE]: 'Xin đổi hình thức',
  [REQUEST_TYPE.TEACHER_SCHEDULE_BUSY]: 'Busy schedule',
  [REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF]: 'Xin nghỉ',
  [REQUEST_TYPE.TEACHER_WEEKLY_NORMS]: 'Weekly norm',
  [REQUEST_TYPE.TEACHER_OTHER]: 'Lịch khác',
} as const

export const requestStatusToBadge = {
  [REQUEST_STATUS.APPROVED]: {
    type: 'success',
    label: requestStatusToTitle[REQUEST_STATUS.APPROVED],
  },
  [REQUEST_STATUS.PENDING]: {
    type: 'warning',
    label: requestStatusToTitle[REQUEST_STATUS.PENDING],
  },
  [REQUEST_STATUS.REJECT]: {
    type: 'error',
    label: requestStatusToTitle[REQUEST_STATUS.REJECT],
  },
  [REQUEST_STATUS.CANCEL]: {
    type: 'default',
    label: requestStatusToTitle[REQUEST_STATUS.CANCEL],
  },
} as const

export const OPTIONS_PERSONAL_SCHEDULE_REQUEST_TYPE: ISelect[] = [
  {
    label: 'Busy schedule',
    value: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
  },
  {
    label: 'Weekly norm',
    value: REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
  },
]

export const OPTIONS_TIME_OFF_REQUEST_TYPE: ISelect[] = [
  {
    label: 'Timeoff',
    value: REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF,
  },
  {
    label: 'Teaching mode change',
    value: REQUEST_TYPE.TEACHING_MODE,
  },
]

export const OPTIONS_REQUEST_STATUS: ISelect[] = [
  {
    label: requestStatusToTitle[REQUEST_STATUS.PENDING],
    value: REQUEST_STATUS.PENDING,
  },
  {
    label: requestStatusToTitle[REQUEST_STATUS.REJECT],
    value: REQUEST_STATUS.REJECT,
  },
  {
    label: requestStatusToTitle[REQUEST_STATUS.APPROVED],
    value: REQUEST_STATUS.APPROVED,
  },
  {
    label: requestStatusToTitle[REQUEST_STATUS.CANCEL],
    value: REQUEST_STATUS.CANCEL,
  },
]
