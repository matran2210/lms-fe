import { ISelect } from 'src/type/course'
import { E_REQUEST_STATUS, E_REQUEST_TYPE } from '../enums'

export const requestStatusToTitle = {
  [E_REQUEST_STATUS.APPROVED]: 'Approved',
  [E_REQUEST_STATUS.PENDING]: 'Pending',
  [E_REQUEST_STATUS.REJECT]: 'Rejected',
  [E_REQUEST_STATUS.CANCEL]: 'Canceled',
} as const

export const requestTypeToTitle = {
  [E_REQUEST_TYPE.TEACHING_MODE]: 'Xin đổi hình thức',
  [E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY]: 'Busy schedule',
  [E_REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF]: 'Xin nghỉ',
  [E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS]: 'Weekly norm',
  [E_REQUEST_TYPE.TEACHER_OTHER]: 'Lịch khác',
} as const

export const requestStatusToBadge = {
  [E_REQUEST_STATUS.APPROVED]: {
    type: 'success',
    label: requestStatusToTitle[E_REQUEST_STATUS.APPROVED],
  },
  [E_REQUEST_STATUS.PENDING]: {
    type: 'warning',
    label: requestStatusToTitle[E_REQUEST_STATUS.PENDING],
  },
  [E_REQUEST_STATUS.REJECT]: {
    type: 'error',
    label: requestStatusToTitle[E_REQUEST_STATUS.REJECT],
  },
  [E_REQUEST_STATUS.CANCEL]: {
    type: 'default',
    label: requestStatusToTitle[E_REQUEST_STATUS.CANCEL],
  },
} as const

export const OPTIONS_PERSONAL_SCHEDULE_REQUEST_TYPE: ISelect[] = [
  {
    label: 'Busy schedule',
    value: E_REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
  },
  {
    label: 'Weekly norm',
    value: E_REQUEST_TYPE.TEACHER_WEEKLY_NORMS,
  },
]

export const OPTIONS_TIME_OFF_REQUEST_TYPE: ISelect[] = [
  {
    label: 'Timeoff',
    value: E_REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF,
  },
  {
    label: 'Teaching mode change',
    value: E_REQUEST_TYPE.TEACHING_MODE,
  },
]

export const OPTIONS_REQUEST_STATUS: ISelect[] = [
  {
    label: requestStatusToTitle[E_REQUEST_STATUS.PENDING],
    value: E_REQUEST_STATUS.PENDING,
  },
  {
    label: requestStatusToTitle[E_REQUEST_STATUS.REJECT],
    value: E_REQUEST_STATUS.REJECT,
  },
  {
    label: requestStatusToTitle[E_REQUEST_STATUS.APPROVED],
    value: E_REQUEST_STATUS.APPROVED,
  },
  {
    label: requestStatusToTitle[E_REQUEST_STATUS.CANCEL],
    value: E_REQUEST_STATUS.CANCEL,
  },
]
