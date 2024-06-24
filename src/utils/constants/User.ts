export const PROFILE_PAGES: any = {
  MYPROFILE: {
    label: 'My Profile',
    children: [] as { label: string }[],
    ga: 'Click My Profile',
  },
  CERTIFICATES: {
    label: 'Certificates',
    children: [] as { label: string }[],
    ga: 'Click Certificates',
  },
  SETTINGS: {
    label: 'Settings',
    children: [] as { label: string }[],
    ga: 'Click Settings',
  },
  SECURITY: {
    label: 'Security',
    children: [
      {
        DEVICES: {
          label: 'Devices',
          ga: 'Click Devices',
        },
      },
      {
        LOGIN_HISTORY: {
          label: 'Login History',
          ga: 'Click Login History',
        },
      },
      {
        CHANGE_PASSWORD: {
          label: 'Change Password',
          ga: 'Click Change Password',
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
