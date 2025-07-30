'use client'

import { processZoomTokenAction } from '@/actions/zoom-actions'
import { ZoomMeeting } from '@/components/ZoomMeeting'
import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingConfig } from '@/types/zoom'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function MeetingPage() {
  const searchParams = useSearchParams()
  const [meetingConfig, setMeetingConfig] = useState<ZoomMeetingConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const encodedToken = searchParams.get('token')

    if (!encodedToken) {
      setError('Token is required')
      setLoading(false)
      return
    }

    const fetchMeetingData = async () => {
      setLoading(true)
      setError(null)
      // Use server action instead of client-side fetch
      const token = decodeURIComponent(encodedToken)
      const data = await processZoomTokenAction(token)

      // Create meeting configuration from the response
      const config: ZoomMeetingConfig = {
        meetingNumber: data.meeting_id,
        passWord: data.password,
        role: ZOOM_CONFIG.ROLES.ATTENDEE,
        userName: data.full_name || data.first_name || 'Guest',
        userEmail: data.email || '',
        tkToken: data.token,
        leaveUrl: window.location.origin,
      }

      setMeetingConfig(config)
      setLoading(false)
    }

    fetchMeetingData()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Error</div>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!meetingConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No meeting configuration available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Zoom Meeting</h1>
          <p className="text-gray-600">Meeting ID: {meetingConfig.meetingNumber}</p>
          <p className="text-gray-600">Participant: {meetingConfig.userName}</p>
        </div>

        <ZoomMeeting config={meetingConfig} />
      </div>
    </div>
  )
}
