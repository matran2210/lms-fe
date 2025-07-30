'use client'

import { ZOOM_CONFIG } from '@/constants/zoom'
import { ZoomMeetingFormData, zoomMeetingFormSchema } from '@/validations/zoomMeetingValidation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface ZoomMeetingFormProps {
  onSubmit: (data: ZoomMeetingFormData) => void
  isLoading?: boolean
  defaultValues?: Partial<ZoomMeetingFormData>
}

export function ZoomMeetingForm({ onSubmit, isLoading = false, defaultValues }: ZoomMeetingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ZoomMeetingFormData>({
    resolver: zodResolver(zoomMeetingFormSchema),
    defaultValues: {
      meetingNumber: defaultValues?.meetingNumber || ZOOM_CONFIG.DEFAULT_MEETING_NUMBER,
      passWord: defaultValues?.passWord || ZOOM_CONFIG.DEFAULT_PASSWORD,
      userName: defaultValues?.userName || ZOOM_CONFIG.DEFAULT_USER_NAME,
      userEmail: defaultValues?.userEmail || ZOOM_CONFIG.DEFAULT_USER_EMAIL,
    },
  })

  const handleFormSubmit = (data: ZoomMeetingFormData) => {
    onSubmit(data)
  }

  const handleReset = () => {
    reset({
      meetingNumber: ZOOM_CONFIG.DEFAULT_MEETING_NUMBER,
      passWord: ZOOM_CONFIG.DEFAULT_PASSWORD,
      userName: ZOOM_CONFIG.DEFAULT_USER_NAME,
      userEmail: ZOOM_CONFIG.DEFAULT_USER_EMAIL,
    })
  }

  const handleJoinByLink = () => {
    // Tạo Zoom meeting link
    const token =
      's4TaWzt3zVBttg3XY9HPWx6+7mdKyS7gwjEYmJd6dPt7BAaQpk85x6vH9Ue0eQ8jQiYjPTYuBU+jROpH3y6I7lIXO5fASorPaMZhhncbh8vbjJrK4RjVBqYCZwYigV+KYAU/ev+tOZN2mnzzeTaxB7ruOiZjVuUokbd7l4pcKccfbWRLsLnssCWiuauEjGNd0HrKOZ75D0scWuKOjbjQgifmuelQsPNL0qcVqkUi2NqpOVKE8+wg7hPosCgIH8EpWX5FE+2xHgI7rKaY6RUKrdYVfidOQ0DVhUzG4897jp2kYlFLQcm4aEMCYrHgGhEOHRdditYcTBnNlLUalIJcPY5LoJX+91bz3JpS5qTDDes='

    // Sử dụng Base64 encoding để tránh vấn đề với các ký tự đặc biệt trong URL
    // const base64Token = btoa(token);
    // const zoomLink = `http://localhost:3000/meeting?token=${base64Token}`;

    // Hoặc sử dụng double encode (đã implement ở trên)
    const encodedToken = encodeURIComponent(token)
    const zoomLink = `http://localhost:3000/meeting?token=${encodedToken}`

    // Mở link trong tab mới
    window.open(zoomLink, '_blank')
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
          Thông tin tham gia Meeting
        </h2>
        <p className="text-gray-600">Vui lòng nhập thông tin để tham gia cuộc họp Zoom</p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Meeting Number */}
        <div>
          <label htmlFor="meetingNumber" className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                />
              </svg>
              Meeting ID *
            </span>
          </label>
          <input
            type="text"
            id="meetingNumber"
            {...register('meetingNumber')}
            className={`w-full px-4 py-3 border-2 rounded-lg font-mono text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.meetingNumber ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Ví dụ: 93218677601"
          />
          {errors.meetingNumber && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.meetingNumber.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="passWord" className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Mật khẩu *
            </span>
          </label>
          <input
            type="password"
            id="passWord"
            {...register('passWord')}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.passWord ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Nhập mật khẩu meeting"
          />
          {errors.passWord && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.passWord.message}
            </p>
          )}
        </div>

        {/* User Name */}
        <div>
          <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Tên hiển thị *
            </span>
          </label>
          <input
            type="text"
            id="userName"
            {...register('userName')}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.userName ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="Tên của bạn trong meeting"
          />
          {errors.userName && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.userName.message}
            </p>
          )}
        </div>

        {/* User Email */}
        <div>
          <label htmlFor="userEmail" className="block text-sm font-semibold text-gray-700 mb-2">
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email *
            </span>
          </label>
          <input
            type="email"
            id="userEmail"
            {...register('userEmail')}
            className={`w-full px-4 py-3 border-2 rounded-lg text-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.userEmail ? 'border-red-300 bg-red-50' : 'border-gray-200 focus:border-blue-500'
            }`}
            placeholder="your-email@example.com"
          />
          {errors.userEmail && (
            <p className="mt-2 text-sm text-red-600 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {errors.userEmail.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting || isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang tham gia...
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
                Tham gia Meeting
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleJoinByLink}
            disabled={isSubmitting || isLoading}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            Tham gia bằng Link
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isSubmitting || isLoading}
            className="sm:flex-initial px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-lg transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Đặt lại
          </button>
        </div>
      </form>
    </div>
  )
}
