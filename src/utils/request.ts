import { REQUEST_STATUS, REQUEST_TYPE } from 'src/constants'

export const requestStatusToBadge = {
  [REQUEST_STATUS.APPROVED]: {
    type: 'success',
    label: 'Approved',
  },
  [REQUEST_STATUS.PENDING]: {
    type: 'warning',
    label: 'Pending',
  },
  [REQUEST_STATUS.REJECT]: {
    type: 'error',
    label: 'Rejected',
  },
  [REQUEST_STATUS.CANCELLED]: {
    type: 'default',
    label: 'Cancelled',
  },
} as const

export const requestTypeToTitle = {
  [REQUEST_TYPE.TEACHING_MODE]: 'Xin đổi hình thức',
  [REQUEST_TYPE.TEACHER_SCHEDULE_BUSY]: 'Busy schedule',
  [REQUEST_TYPE.TEACHER_SCHEDULE_TIME_OFF]: 'Lịch nghỉ',
  [REQUEST_TYPE.TEACHER_WEEKLY_NORMS]: 'Weekly norm',
  [REQUEST_TYPE.TEACHER_OTHER]: 'Lịch khác',
} as const
