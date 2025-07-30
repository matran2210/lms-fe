'use client'

import { ZoomMeetingForm } from '@/components/ZoomMeetingForm'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig } from '@/types/zoom'
import { ZoomMeetingFormData } from '@/validations/zoomMeetingValidation'
import dynamic from 'next/dynamic'
import { useState } from 'react'

// Dynamic import to avoid SSR issues with Zoom SDK
const ZoomMeeting = dynamic(() => import('@/components/ZoomMeeting').then(mod => ({ default: mod.ZoomMeeting })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Loading Zoom Meeting...</span>
    </div>
  ),
})

export default function Home() {
  const [meetingConfig, setMeetingConfig] = useState<ZoomMeetingConfig | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  const handleFormSubmit = async (formData: ZoomMeetingFormData) => {
    setIsJoining(true)

    // Create meeting configuration from form data
    const config: ZoomMeetingConfig = {
      meetingNumber: formData.meetingNumber,
      passWord: formData.passWord,
      role: ZOOM_CONFIG.ROLES.ATTENDEE, // Default to attendee
      userName: formData.userName,
      userEmail: formData.userEmail,
      tkToken: '',
      leaveUrl: process.env.NEXT_PUBLIC_ZOOM_LEAVE_URL || ZOOM_CONFIG.DEFAULT_LEAVE_URL,
    }

    // Set meeting config to start the meeting
    setMeetingConfig(config)
    setIsJoining(false)
  }

  const handleBackToForm = () => {
    setMeetingConfig(null)
    setIsJoining(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!meetingConfig ? (
          // Show form when no meeting is configured
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">🎥 Tham gia Meeting Zoom</h1>
            </div>

            <ZoomMeetingForm onSubmit={handleFormSubmit} isLoading={isJoining} />
          </div>
        ) : (
          // Show meeting when configured
          <div className="bg-white rounded-lg shadow-xl p-6">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">🎥 Zoom Meeting</h1>
                <p className="text-gray-600">
                  Bạn đang tham gia cuộc họp với Meeting ID:{' '}
                  <span className="font-mono font-semibold">{meetingConfig.meetingNumber}</span>
                </p>
              </div>

              <button
                onClick={handleBackToForm}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Về Form
              </button>
            </div>

            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Thông tin Meeting
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-800">Meeting ID:</span>
                    <br />
                    <span className="text-blue-700 font-mono">{meetingConfig.meetingNumber}</span>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-800">Tên hiển thị:</span>
                    <br />
                    <span className="text-blue-700">{meetingConfig.userName}</span>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-800">Email:</span>
                    <br />
                    <span className="text-blue-700">{meetingConfig.userEmail}</span>
                  </div>
                </div>

                <div className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <span className="font-medium text-blue-800">Vai trò:</span>
                    <br />
                    <span className="text-blue-700">
                      {meetingConfig.role === ZOOM_CONFIG.ROLES.HOST ? 'Host' : 'Người tham gia'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <ZoomMeeting config={meetingConfig} />
          </div>
        )}
      </div>
    </div>
  )
}
