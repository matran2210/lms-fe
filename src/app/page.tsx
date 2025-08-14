import { ZoomMeetingForm } from '@/components/ZoomMeetingForm'

export const metadata = {
  title: 'Zoom Meeting',
  description: 'Zoom Meeting',
}

export default function Home() {
  return (
    <main className="bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <ZoomMeetingForm />
      </div>
    </main>
  )
}
