// Contstants for the application

export const COOKIE_INFO = {
  SESSION_ID: 'sessionId',
  KEYCLOAK_USER_ID: 'keycloakUserId',
  KEYCLOAK_TOKEN: 'keycloakToken',
  KEYCLOAK_REFRESH_TOKEN: 'keycloakRefreshToken',
}

export const TOKEN_STORAGE_KEY = 'zoom_meeting_token'

export const HEADER_HEIGHT = 64

export const FLOATING_USER_ID = 'floating-user'

export const SHOW_FULL_SCREEN_CLASS = 'show-full-screen'

export const FLOATING_USER_POSITION_INTERVAL = 30 * 1000 // 30 seconds

export const HOME_LMS_URL = process.env.NEXT_PUBLIC_LMS_FE_URL || '/'
