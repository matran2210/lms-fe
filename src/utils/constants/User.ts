export const PROFILE_PAGES = {
  MYPROFILE: {
    label: 'My Profile',
    children: [],
  },
  CERTIFICATES: {
    label: 'Certificates',
    children: [],
  },
  SETTINGS: {
    label: 'Settings',
    children: [],
  },
  SECURITY: {
    label: 'Security',
    children: [
      {
        DEVICES: {
          label: 'Devices',
        },
      },
      {
        LOGIN_HISTORY: {
          label: 'Login History',
        },
      },
    ],
  },
}

export const MYCOURSE_PAGES = {
  ALL: {
    label: 'All',
  },
  CFA: {
    label: 'Cfa',
  },
  ACCA: {
    label: 'Acca',
  },
  CMA: {
    label: 'Cma',
  },
}

export const USER_TYPE = {
  STUDENT: { key: 'STUDENT', label: 'Học viên' },
  TEACHER: { key: 'TEACHER', label: 'Giáo viên' },
}
export const USER_STATUS = {
  ACTIVE: { key: 'ACTIVE', label: 'Active', color: 'text-state-success' },
}
