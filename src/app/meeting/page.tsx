import SAPPLoading from '@/components/loading/SAPPLoading'
import { ZoomMeeting } from '@/components/ZoomMeeting'
import { Suspense } from 'react'

export default function MeetingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <Suspense fallback={<SAPPLoading />}>
          <ZoomMeeting />
        </Suspense>
      </div>
    </div>
  )
}
