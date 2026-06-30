'use client'

import { HOME_LMS_URL } from '@/constants'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig, ZoomMeetingSDK } from '@/types/zoom'
import { toggleMeetingContainer } from '@/utils'
import { useCallback, useEffect, useRef, useState } from 'react'

export const useZoomSDK = () => {
  const zoomMtgRef = useRef<ZoomMeetingSDK | null>(null)
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Zoom SDK (client-only dynamic import; must match @zoom/meetingsdk version)
  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        const { ZoomMtg } = await import('@zoom/meetingsdk')
        zoomMtgRef.current = ZoomMtg

        ZoomMtg.setZoomJSLib(ZOOM_CONFIG.SDK_LIB_URL, '/av')
        ZoomMtg.preLoadWasm()
        ZoomMtg.prepareWebSDK()

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
      const ZoomMtg = zoomMtgRef.current
      if (!isSDKLoaded || !ZoomMtg) {
        throw new Error(ZOOM_CONFIG.ERROR_MESSAGES.SDK_NOT_LOADED)
      }

      toggleMeetingContainer('block')

      try {
        ZoomMtg.i18n.load('vi-VN')
        ZoomMtg.init({
          leaveUrl: HOME_LMS_URL,
          patchJsMedia: ZOOM_CONFIG.SDK_CONFIG.PATCH_JS_MEDIA,
          leaveOnPageUnload: ZOOM_CONFIG.SDK_CONFIG.LEAVE_ON_PAGE_UNLOAD,
          meetingInfo: [],
          disableInvite: true,
          inviteUrlFormat: '',
          success: () => {
            ZoomMtg.join({
              signature: config.signature,
              sdkKey: config.sdkKey,
              meetingNumber: config.meetingNumber,
              passWord: config.passWord,
              userName: config.userName,
              userEmail: config.userEmail,
              tk: config.tkToken,
              success: () => {
                ZoomMtg.showInviteFunction({ show: false })

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
