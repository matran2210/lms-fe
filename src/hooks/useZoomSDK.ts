import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig } from '@/types/zoom'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export const useZoomSDK = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Zoom SDK
  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        await import('@zoom/meetingsdk')

        // Initialize SDK using window.ZoomMtg
        window.ZoomMtg.preLoadWasm()
        window.ZoomMtg.prepareWebSDK()

        setIsSDKLoaded(true)
      } catch (err) {
        setError(ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_LOAD_SDK)
      }
    }

    loadZoomSDK()
  }, [])

  const toggleMeetingContainer = useCallback((display: 'block' | 'none') => {
    const zoomContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID)
    if (zoomContainer) {
      zoomContainer.style.display = display
    }
  }, [])

  // Join meeting
  const joinMeeting = useCallback(
    async (config: ZoomMeetingConfig) => {
      if (!isSDKLoaded || !window.ZoomMtg) {
        throw new Error(ZOOM_CONFIG.ERROR_MESSAGES.SDK_NOT_LOADED)
      }

      setIsJoining(true)
      setError(null)

      toggleMeetingContainer('block')

      try {
        window.ZoomMtg.i18n.load('vi-VN')
        window.ZoomMtg.init({
          leaveUrl: ZOOM_CONFIG.SDK_CONFIG.LEAVE_URL,
          patchJsMedia: ZOOM_CONFIG.SDK_CONFIG.PATCH_JS_MEDIA,
          leaveOnPageUnload: ZOOM_CONFIG.SDK_CONFIG.LEAVE_ON_PAGE_UNLOAD,
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
                toast.success(ZOOM_CONFIG.SUCCESS_MESSAGES.JOINED_MEETING)
                setIsJoining(false)
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
        // toggleMeetingContainer('none')
        setError(err instanceof Error ? err.message : ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_JOIN_MEETING)
        setIsJoining(false)
      }
    },
    [isSDKLoaded]
  )

  const leaveMeeting = useCallback(() => {
    toggleMeetingContainer('none')
  }, [])

  return {
    isSDKLoaded,
    isJoining,
    error,
    joinMeeting,
    leaveMeeting,
  }
}
