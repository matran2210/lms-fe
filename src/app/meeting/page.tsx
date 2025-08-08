import { ZoomMeeting } from '@/components/ZoomMeeting'
import { Suspense } from 'react'

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Suspense fallback={<div>Loading...</div>}>
          <ZoomMeeting />
        </Suspense>
      </div>
    </div>
  )
}
