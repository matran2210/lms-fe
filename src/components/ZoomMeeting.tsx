'use client'

import { processZoomMeetingAction } from '@/actions/zoom-actions'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { useZoomSDK } from '@/hooks/useZoomSDK'
import { ZoomMeetingConfig } from '@/types/zoom'
import { useEffect, useState } from 'react'

interface ZoomMeetingProps {
  token: string
  className?: string
}

export const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ token, className = '' }) => {
  const { isSDKLoaded, isJoining, error, joinMeeting } = useZoomSDK()
  const [meetingConfig, setMeetingConfig] = useState<ZoomMeetingConfig | null>(null)
  const [isLoadingMeetingData, setIsLoadingMeetingData] = useState(true)
  const [hasJoined, setHasJoined] = useState(false)

  // Process token and prepare meeting data
  useEffect(() => {
    const processMeetingToken = async () => {
      if (!token) {
        setIsLoadingMeetingData(false)
        return
      }

      try {
        setIsLoadingMeetingData(true)

        const decodedToken = decodeURIComponent(token)
        const meetingData = await processZoomMeetingAction(decodedToken)

        const config: ZoomMeetingConfig = {
          meetingNumber: meetingData.userInfo.meeting_id,
          passWord: meetingData.userInfo.password,
          userName: meetingData.userInfo.full_name || meetingData.userInfo.first_name || 'Guest',
          userEmail: meetingData.userInfo.email || '',
          tkToken: meetingData.userInfo.token,
          signature: meetingData.signature.signature,
          sdkKey: meetingData.signature.sdk_key,
        }

        setMeetingConfig(config)
        setIsLoadingMeetingData(false)
      } catch (err) {
        setIsLoadingMeetingData(false)
      }
    }

    processMeetingToken()
  }, [token])

  // Auto join meeting when SDK is loaded and meeting config is ready
  useEffect(() => {
    if (isSDKLoaded && meetingConfig && !isJoining && !error && !hasJoined) {
      handleJoinMeeting()
    }
  }, [isSDKLoaded, meetingConfig, isJoining, error, hasJoined])

  const handleJoinMeeting = async () => {
    if (!meetingConfig) return

    try {
      setHasJoined(true)
      await joinMeeting(meetingConfig)
    } catch (err) {
      setHasJoined(false)
    }
  }

  // Show loading state for meeting data
  if (isLoadingMeetingData) {
    return (
      <div className={`zoom-meeting-container ${className}`}>
        <div className="flex items-center justify-center p-8 bg-blue-50 rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
          <span className="text-blue-700 font-medium text-lg">Đang tải thông tin cuộc họp...</span>
        </div>
      </div>
    )
  }

  if (!meetingConfig) {
    return (
      <div className={`zoom-meeting-container ${className}`}>
        <p className="text-gray-600 text-center p-8">Không có thông tin cuộc họp</p>
      </div>
    )
  }

  return (
    <div className={`zoom-meeting-container ${className}`}>
      <div className="zoom-controls mb-6">
        {!isSDKLoaded && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700 font-medium">Đang tải Zoom SDK...</span>
          </div>
        )}

        {isJoining && (
          <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-3"></div>
            <span className="text-green-700 font-medium">Đang tham gia cuộc họp...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Lỗi cuộc họp</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleJoinMeeting}
                    className="text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom SDK Container */}
      <div id={ZOOM_CONFIG.MEETING_CONTAINER_ID} className="zoom-meeting-frame" style={{ display: 'none' }} />
    </div>
  )
}
