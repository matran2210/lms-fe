export const ZOOM_CONFIG = {
  // SDK Configuration
  SDK_CONFIG: {
    PATCH_JS_MEDIA: true,
    LEAVE_ON_PAGE_UNLOAD: true,
  } as const,

  // Meeting container
  MEETING_CONTAINER_ID: 'zmmtg-root', // Default by zoom-sdk
  MEETING_VIDEO_FRAME: 'single-main-container__video-frame',
  MEETING_FULL_SCREEN_WIDGET: 'full-screen-widget',
  MEETING_FULL_SCREEN_WIDGET_EXIT: 'Exit Full Screen',

  // Error messages
  ERROR_MESSAGES: {
    SDK_NOT_LOADED: 'Zoom SDK not loaded',
    FAILED_TO_LOAD_SDK: 'Failed to load Zoom SDK',
    FAILED_TO_JOIN_MEETING: 'Failed to join meeting',
    FAILED_TO_INIT_SDK: 'Failed to initialize Zoom SDK',
  } as const,
} as const
