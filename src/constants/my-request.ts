export const REQUEST_TYPE = {
  BUSY_SCHEDULE: {
    value: 'TEACHER_SCHEDULE_BUSY',
    label: 'Busy Schedule',
  },
  WEEKLY_NORM: {
    value: 'TEACHER_WEEKLY_NORMS',
    label: 'Weekly Norm',
  },
  TIMEOFF: {
    value: 'TEACHER_SCHEDULE_TIME_OFF',
    label: 'Timeoff',
  },
  TEACHING_MODE: {
    value: 'TEACHING_MODE',
    label: 'Teaching mode change',
  },
}
export const REQUEST_STATUS = {
  PENDING: {
    value: 'PENDING',
    label: 'Pending',
  },

  APPROVED: {
    value: 'APPROVED',
    label: 'Approved',
  },
  REJECTED: {
    value: 'REJECTED',
    label: 'Reject',
  },
  CANCELLED: {
    value: 'CANCELLED',
    label: 'Cancelled',
  },
}

export enum CONSTRUCTION_MODE {
  OFFLINE = 'OFFLINE',
  ONLINE = 'ONLINE',
}
export enum TYPE_TEACHING_REQUEST {
  TEACHING_MODE = 'TEACHING_MODE',
  TEACHER_SECTION = 'TEACHER_SECTION',
}
