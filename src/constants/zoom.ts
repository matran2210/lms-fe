export const ZOOM_CONFIG = {
  // SDK Configuration
  SDK_CONFIG: {
    PATCH_JS_MEDIA: true,
    LEAVE_ON_PAGE_UNLOAD: true,
  } as const,

  // Meeting container
  MEETING_CONTAINER_ID: '#zmmtg-root', // Default by zoom-sdk

  MEETING_FULL_SCREEN_WIDGET: '.full-screen-widget',
  MEETING_FULL_SCREEN_DROPDOWN: '#full-screen-dropdown',
  MEETING_FULL_SCREEN_DROPDOWN_POP_MENU: '.full-screen-widget__pop-menu > a:last-of-type',

  MEETING_FULL_SCREEN_WIDGET_EXIT: 'Exit Full Screen',
  MEETING_FULL_SCREEN_DROPDOWN_EXIT: 'Thoát khỏi Chế độ toàn màn hình',

  MEETING_VIDEO_SHARE_LAYOUT: '.video-share-layout',
  MEETING_VIDEO_SHARE_LAYOUT_STANDARD: 'video-share-standrad',
  MEETING_VIDEO_SHARE_LAYOUT_PANE_1: '.Pane.Pane1',
  MEETING_VIDEO_SHARE_LAYOUT_SHARER_CONTAINER: '.sharee-container__viewport',

  MEETING_SPEAKER_ACTIVE_CONTAINER: '.speaker-active-container__wrap',
  MEETING_SPEAKER_ACTIVE_CONTAINER_VIDEO_FRAME: '.speaker-active-container__video-frame',

  MEETING_GALLERY_VIDEO_CONTAINER: '.gallery-video-container__main-view',
  MEETING_GALLERY_VIDEO_CONTAINER_VIDEO_FRAME: '.gallery-video-container__video-frame',

  MEETING_MULTI_SPEAKER_CONTAINER: '.multi-speaker-container',
  MEETING_MULTI_SPEAKER_CONTAINER_MAIN_VIEW: '.multi-speaker-main-container__main-view',
  MEETING_MULTI_SPEAKER_CONTAINER_VIDEO_FRAME: '.multi-speaker-container__video-frame',

  MEETING_MULTI_SPEAKER_ACTIVE_CONTAINER_MAIN_VIEW: '.multi-speaker-active-container__main-view',

  // Error messages
  ERROR_MESSAGES: {
    SDK_NOT_LOADED: 'Zoom SDK not loaded',
    FAILED_TO_LOAD_SDK: 'Failed to load Zoom SDK',
    FAILED_TO_JOIN_MEETING: 'Failed to join meeting',
    FAILED_TO_INIT_SDK: 'Failed to initialize Zoom SDK',
  } as const,
} as const

export const ZOOM_ARIA_LABELS: string[] = [
  ZOOM_CONFIG.MEETING_FULL_SCREEN_WIDGET_EXIT,
  ZOOM_CONFIG.MEETING_FULL_SCREEN_DROPDOWN_EXIT,
]
