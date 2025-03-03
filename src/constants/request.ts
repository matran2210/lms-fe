export enum REQUEST_TYPE {
  TEACHING_MODE = 'TEACHING_MODE',
  TEACHER_SCHEDULE_BUSY = 'TEACHER_SCHEDULE_BUSY',
  TEACHER_SCHEDULE_TIME_OFF = 'TEACHER_SCHEDULE_TIME_OFF',
  TEACHER_OTHER = 'TEACHER_OTHER',
  TEACHER_WEEKLY_NORMS = 'TEACHER_WEEKLY_NORMS',
}

export const OPTIONS_REQUEST_TYPE = [
  {
    label: 'Busy schedule',
    value: REQUEST_TYPE.TEACHER_SCHEDULE_BUSY,
  },
  {
    label: 'Weekly norm',
    value: REQUEST_TYPE.TEACHER_OTHER,
  },
]

export enum REQUEST_STATUS {
  PENDING = 'PENDING',
  REJECT = 'REJECT',
  CANCELLED = 'CANCELLED',
  APPROVED = 'APPROVED',
}

export const OPTIONS_REQUEST_STATUS = [
  {
    label: 'Pending',
    value: REQUEST_STATUS.PENDING,
  },
  {
    label: 'Reject',
    value: REQUEST_STATUS.REJECT,
  },
  {
    label: 'Approved',
    value: REQUEST_STATUS.APPROVED,
  },
  {
    label: 'Cancelled',
    value: REQUEST_STATUS.CANCELLED,
  },
]
