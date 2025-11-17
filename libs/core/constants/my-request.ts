export const REQUEST_TYPE = {
  BUSY_SCHEDULE: {
    value: 'TEACHER_SCHEDULE_BUSY',
    label: 'Busy Schedule',
    colorClass: 'text-state-cancel',
  },
  WEEKLY_NORM: {
    value: 'TEACHER_WEEKLY_NORMS',
    label: 'Weekly Norm',
    colorClass: 'text-blue-3',
  },
  TIMEOFF: {
    value: 'TEACHER_SCHEDULE_TIME_OFF',
    label: 'Timeoff',
    colorClass: 'text-green-1',
  },
  TEACHING_MODE: {
    value: 'TEACHING_MODE',
    label: 'Teaching mode change',
    colorClass: 'text-green-1',
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

