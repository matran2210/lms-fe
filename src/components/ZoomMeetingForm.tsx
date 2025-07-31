'use client'

import Link from 'next/link'

export function ZoomMeetingForm() {
  const handleGetLink = () => {
    const token =
      's4TaWzt3zVBttg3XY9HPWx6+7mdKyS7gwjEYmJd6dPt7BAaQpk85x6vH9Ue0eQ8jQiYjPTYuBU+jROpH3y6I7lIXO5fASorPaMZhhncbh8vbjJrK4RjVBqYCZwYigV+KYAU/ev+tOZN2mnzzeTaxB7ruOiZjVuUokbd7l4pcKccfbWRLsLnssCWiuauEjGNd0HrKOZ75D0scWuKOjbjQgifmuelQsPNL0qcVqkUi2NqpOVKE8+wg7hPosCgIH8EpWX5FE+2xHgI7rKaY6RUKrdYVfidOQ0DVhUzG4897jp2kYlFLQcm4aEMCYrHgGhEOHRdditYcTBnNlLUalIJcPY5LoJX+91bz3JpS5qTDDes='
    const encodedToken = encodeURIComponent(token)
    const zoomLink = `/meeting?token=${encodedToken}`
    return zoomLink
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Tham gia Zoom Meeting
        </h2>
        <p className="text-gray-600 text-lg">Nhấn vào nút bên dưới để tham gia cuộc họp Zoom</p>
      </div>

      {/* Meeting Join Section */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Tham gia nhanh chóng</h3>
          <p className="text-gray-600 mb-6">Cuộc họp được cấu hình sẵn và sẵn sàng để bạn tham gia</p>

          <Link
            href={handleGetLink()}
            target="_blank"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-lg transition-all duration-200 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Tham gia Zoom Meeting
          </Link>
        </div>

        {/* Additional Info */}
        <div className="text-sm text-gray-500 space-y-2">
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Tự động tham gia cuộc họp
          </p>
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thông tin đã được cấu hình sẵn
          </p>
          <p className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Mở trong tab mới
          </p>
        </div>
      </div>
    </div>
  )
}
