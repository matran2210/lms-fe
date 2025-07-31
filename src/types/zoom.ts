import { ZoomMtgLang } from '@zoom/meetingsdk'

export interface ZoomMeetingConfig {
  meetingNumber: string
  passWord: string
  userName: string
  userEmail: string
  tkToken: string
  signature: string
  sdkKey: string
}

export interface ZoomSignature {
  signature: string
  sdk_key: string
}

export interface ZoomDecryptedToken {
  user_id: string
  meeting_id: string
  token: string
  password: string
}

export interface DecryptedZoomUserInfo extends ZoomDecryptedToken {
  email: string | null
  full_name: string | null
  first_name: string | null
}

export interface ZoomTokenRequest {
  token: string
}

export interface ZoomTokenResponse {
  signature: string
  sdkKey: string
  meetingInfo: DecryptedZoomUserInfo
}

export interface ZoomMeetingSDK {
  preLoadWasm: () => void
  prepareWebSDK: () => void
  init: (config: ZoomInitConfig) => void
  join: (config: ZoomJoinConfig) => void
  i18n: typeof ZoomMtgLang
}

export interface ZoomInitConfig {
  leaveUrl: string
  patchJsMedia?: boolean
  leaveOnPageUnload?: boolean
  success: (success: unknown) => void
  error: (error: unknown) => void
}

export interface ZoomJoinConfig {
  signature: string
  sdkKey: string
  meetingNumber: string
  passWord: string
  userName: string
  userEmail: string
  tk?: string
  success: (success: unknown) => void
  error: (error: unknown) => void
}

declare global {
  interface Window {
    ZoomMtg: ZoomMeetingSDK
  }
}
