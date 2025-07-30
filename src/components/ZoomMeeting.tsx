'use client'

import { ZOOM_CONFIG } from '@/constants/zoom'
import { useZoomSDK } from '@/hooks/useZoomSDK'
import { ZoomMeetingConfig } from '@/types/zoom'

interface ZoomMeetingProps {
  config: ZoomMeetingConfig
  className?: string
}

export const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ config, className = '' }) => {
  const { isSDKLoaded, isJoining, error, joinMeeting, leaveMeeting } = useZoomSDK()

  const handleJoinMeeting = async () => {
    try {
      await joinMeeting(config)
    } catch (err) {
      console.error('Failed to join meeting:', err)
    }
  }

  const handleLeaveMeeting = () => {
    leaveMeeting()
  }

  return (
    <div className={`zoom-meeting-container ${className}`}>
      <div className="zoom-controls mb-6">
        {!isSDKLoaded && (
          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-blue-700 font-medium">Loading Zoom SDK...</span>
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
                <h3 className="text-sm font-medium text-red-800">Meeting Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSDKLoaded && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleJoinMeeting}
              disabled={isJoining}
              className="flex items-center justify-center px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              {isJoining ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Joining Meeting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Join Meeting
                </>
              )}
            </button>

            <button
              onClick={handleLeaveMeeting}
              className="flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-md"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Leave Meeting
            </button>
          </div>
        )}
      </div>

      {/* Zoom SDK Container */}
      <div id={ZOOM_CONFIG.MEETING_CONTAINER_ID} className="zoom-meeting-frame" style={{ display: 'none' }} />
    </div>
  )
}
