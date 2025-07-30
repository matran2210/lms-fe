'use client'

import { getZoomSignatureAction } from '@/actions/zoom-actions'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig } from '@/types/zoom'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

// Dynamic import type for Zoom SDK
let ZoomMtg: any = null

export const useZoomSDK = () => {
  const [isSDKLoaded, setIsSDKLoaded] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load Zoom SDK
  useEffect(() => {
    const loadZoomSDK = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') return

        // Dynamically import Zoom SDK to avoid SSR issues
        const { ZoomMtg: ZoomMtgModule } = await import('@zoom/meetingsdk')
        ZoomMtg = ZoomMtgModule

        // Initialize SDK
        ZoomMtg.preLoadWasm()
        ZoomMtg.prepareWebSDK()

        setIsSDKLoaded(true)
      } catch (err) {
        setError(ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_LOAD_SDK)
      }
    }

    loadZoomSDK()
  }, [])

  // Get signature from server action (server-side)
  const getSignature = useCallback(async (meetingNumber: string) => {
    // Use server action instead of client-side fetch
    const result = await getZoomSignatureAction(meetingNumber)

    return {
      signature: result.signature,
      sdkKey: result.sdk_key,
    }
  }, [])

  // Join meeting
  const joinMeeting = useCallback(
    async (config: ZoomMeetingConfig) => {
      if (!isSDKLoaded || !ZoomMtg) {
        throw new Error(ZOOM_CONFIG.ERROR_MESSAGES.SDK_NOT_LOADED)
      }

      setIsJoining(true)
      setError(null)

      try {
        // Get signature and sdkKey
        const { signature, sdkKey } = await getSignature(config.meetingNumber)

        // Show Zoom meeting container
        const zoomContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID)
        if (zoomContainer) {
          zoomContainer.style.display = 'block'
        }

        // Initialize Zoom SDK
        ZoomMtg.init({
          leaveUrl: config.leaveUrl,
          patchJsMedia: ZOOM_CONFIG.SDK_CONFIG.PATCH_JS_MEDIA,
          leaveOnPageUnload: ZOOM_CONFIG.SDK_CONFIG.LEAVE_ON_PAGE_UNLOAD,
          success: () => {
            // Join the meeting
            ZoomMtg.join({
              signature,
              sdkKey,
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
        setError(err instanceof Error ? err.message : ZOOM_CONFIG.ERROR_MESSAGES.FAILED_TO_JOIN_MEETING)
        setIsJoining(false)
      }
    },
    [isSDKLoaded, getSignature]
  )

  // Leave meeting
  const leaveMeeting = useCallback(() => {
    const zoomContainer = document.getElementById(ZOOM_CONFIG.MEETING_CONTAINER_ID)
    if (zoomContainer) {
      zoomContainer.style.display = 'none'
    }
  }, [])

  return {
    isSDKLoaded,
    isJoining,
    error,
    joinMeeting,
    leaveMeeting,
  }
}
