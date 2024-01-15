export const PROFILE_PAGES = {
  MYPROFILE: {
    label: 'My Profile',
    children: [] as { label: string }[],
  },
  CERTIFICATES: {
    label: 'Certificates',
    children: [] as { label: string }[],
  },
  SETTINGS: {
    label: 'Settings',
    children: [] as { label: string }[],
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
