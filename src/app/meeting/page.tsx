'use client'

import { ZoomMeeting } from '@/components/ZoomMeeting'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export default function MeetingPage() {
  const searchParams = useSearchParams()
  const token = useMemo(() => searchParams.get('token'), [])

  if (!token) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">Lỗi</div>
          <p className="text-gray-600">Không tìm thấy token cuộc họp</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <ZoomMeeting token={token} />
      </div>
    </div>
  )
}
