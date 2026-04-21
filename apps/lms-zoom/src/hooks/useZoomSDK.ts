'use client'

import { HOME_LMS_URL } from '@/constants'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig } from '@/types/zoom'
import { toggleMeetingContainer } from '@/utils'
import { useCallback, useEffect, useState } from 'react'

export const useZoomSDK = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Zoom SDK
  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        await import('@zoom/meetingsdk')

        window.ZoomMtg.setZoomJSLib('https://source.zoom.us/5.1.4/lib', '/av')
        window.ZoomMtg.preLoadWasm()
        window.ZoomMtg.prepareWebSDK()

        setIsSDKLoaded(true)
      } catch (err) {
        setError(ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_LOAD_SDK)
      }
    }

    loadZoomSDK()
  }, [])

  // Join meeting
  const joinMeeting = useCallback(
    async (config: ZoomMeetingConfig) => {
      if (!isSDKLoaded || !window.ZoomMtg) {
        throw new Error(ZOOM_CONFIG.ERROR_MESSAGES.SDK_NOT_LOADED)
      }

      toggleMeetingContainer('block')

      try {
        window.ZoomMtg.i18n.load('vi-VN')
        window.ZoomMtg.init({
          leaveUrl: HOME_LMS_URL,
          patchJsMedia: ZOOM_CONFIG.SDK_CONFIG.PATCH_JS_MEDIA,
          leaveOnPageUnload: ZOOM_CONFIG.SDK_CONFIG.LEAVE_ON_PAGE_UNLOAD,
          meetingInfo: [],
          disableInvite: true,
          success: () => {
            // Join the meeting
            window.ZoomMtg.join({
              signature: config.signature,
              sdkKey: config.sdkKey,
              meetingNumber: config.meetingNumber,
              passWord: config.passWord,
              userName: config.userName,
              userEmail: config.userEmail,
              tk: config.tkToken,
              success: () => {
                setIsJoining(false)
                setIsJoined(true)
              },
              error: () => {
                setError(ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_JOIN_MEETING)
                setIsJoining(false)
              },
            })
          },
          error: () => {
            setError(ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_INIT_SDK)
            setIsJoining(false)
          },
        })
      } catch (err) {
        toggleMeetingContainer('none')
        setError(err instanceof Error ? err.message : ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_JOIN_MEETING)
        setIsJoining(false)
      }
    },
    [isSDKLoaded]
  )

  return {
    isSDKLoaded,
    isJoining,
    isJoined,
    error,
    joinMeeting,
  }
}
