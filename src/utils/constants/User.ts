export const PROFILE_PAGES = {
  MYPROFILE: {
    label: 'My Profile',
    children: [
      {
        OVERVIEW: {
          label: 'Overview',
        },
      },
      {
        CMA: {
          label: 'CMA',
        },
      },
      {
        CFA: {
          label: 'CFA',
        },
      },
      {
        ACCA: {
          label: 'ACCA',
        },
      },
    ],
  },
  CERTIFICATES: {
    label: 'Certificates',
    children: [] as { label: string }[],
  },
  // EXAM_INFO: {
  //   label: 'Exam Information',
  //   children: [] as { label: string }[],
  // },
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
      {
        CHANGE_PASSWORD: {
          label: 'Change Password',
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

export const SECURITY_TREE = ['devices', 'login_history', 'change_password']
export const MYPROFILE_TREE = ['overview', 'cfa', 'cma', 'acca']
