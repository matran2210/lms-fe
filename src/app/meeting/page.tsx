'use client'

import { ZoomMeeting } from '@/components/ZoomMeeting'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo } from 'react'

function MeetingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const token = useMemo(() => searchParams.get('token'), [])

  useEffect(() => {
    if (token) {
      router.replace(pathname, { scroll: false })
    }
  }, [router, pathname])

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

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

export default function MeetingPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <MeetingContent />
    </Suspense>
  )
}
