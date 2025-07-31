import { ZoomMeetingForm } from '@/components/ZoomMeetingForm'

export const metadata = {
  title: 'Zoom Meeting',
  description: 'Zoom Meeting',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ZoomMeetingForm />
      </div>
    </main>
  )
}
