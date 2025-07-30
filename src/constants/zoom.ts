export const ZOOM_CONFIG = {
  // Default meeting configuration
  DEFAULT_MEETING_NUMBER: '93218677601',
  DEFAULT_PASSWORD: '733327',
  DEFAULT_USER_NAME: 'VDD',
  DEFAULT_USER_EMAIL: 'vdinhdung2001@gmail.com',
  DEFAULT_LEAVE_URL: 'http://localhost:3000',

  // Meeting roles
  ROLES: {
    ATTENDEE: 0,
    HOST: 1,
  } as const,

  // SDK Configuration
  SDK_CONFIG: {
    PATCH_JS_MEDIA: true,
    LEAVE_ON_PAGE_UNLOAD: true,
    VIDEO_WEB_RTC_MODE: 1,
  } as const,

  // API Endpoints
  API_ENDPOINTS: {
    SIGNATURE: '/api/zoom-signature',
    TOKEN: '/api/zoom-token',
  } as const,

  // Meeting container
  MEETING_CONTAINER_ID: 'zmmtg-root',

  // Success messages
  SUCCESS_MESSAGES: {
    JOINED_MEETING: 'Joined meeting successfully',
  } as const,

  // Error messages
  ERROR_MESSAGES: {
    SDK_NOT_LOADED: 'Zoom SDK not loaded',
    FAILED_TO_LOAD_SDK: 'Failed to load Zoom SDK',
    FAILED_TO_GET_SIGNATURE: 'Failed to get meeting signature',
    FAILED_TO_JOIN_MEETING: 'Failed to join meeting',
    FAILED_TO_INIT_SDK: 'Failed to initialize Zoom SDK',
    CREDENTIALS_NOT_CONFIGURED: 'Zoom SDK credentials not configured',
    MEETING_NUMBER_REQUIRED: 'Meeting number is required',
  } as const,
} as const

export type ZoomRole = (typeof ZOOM_CONFIG.ROLES)[keyof typeof ZOOM_CONFIG.ROLES]
