export interface ZoomMeetingConfig {
  userId: string
  meetingNumber: string
  passWord: string
  userName: string
  userEmail: string
  tkToken: string
  signature: string
  sdkKey: string
  hubspotContactId: string
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
  hubspot_contact_id: string
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

export type ZoomMeetingSDK = typeof import('@zoom/meetingsdk').ZoomMtg

declare global {
  interface Window {
    ZoomMtg: ZoomMeetingSDK
  }
}
