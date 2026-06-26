'use client'

import { HOME_LMS_URL } from '@/constants'
import SAPPButton from './button/SAPPButton'
import BaseModal from './modal/BaseModal'

/**
 * Modal cảnh báo khi phát hiện watermark (FloatingUser) bị can thiệp ẩn đi
 * (display:none / visibility:hidden / opacity / thuộc tính hidden / gỡ khỏi DOM...).
 *
 * Dùng BaseModal (antd Modal) hiển thị đè toàn màn hình, không cho đóng. Nhờ vậy
 * thay vì để màn hình trắng, người dùng luôn thấy cảnh báo này.
 */
const TamperWarning = () => {
  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const handleBackToLms = () => {
    if (typeof window !== 'undefined') {
      window.location.href = HOME_LMS_URL
    }
  }

  return (
    <BaseModal open closable={false} maskClosable={false} keyboard={false} title={null}>
      <div className="border-t-[6px] border-red-600">
        <div className="flex flex-col items-center px-8 py-8 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              width={32}
              height={32}
              className="h-8 w-8 text-red-600"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2 className="mb-3 text-xl font-bold text-gray-900">Phát hiện can thiệp bảo mật</h2>

          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            Cuộc họp đã tạm dừng do hệ thống phát hiện có sự can thiệp vào tính năng bảo mật. Vui lòng tắt các
            extension rồi tải lại trang, hoặc sử dụng trình duyệt khác để tham gia lớp học.
          </p>

          <div className="mb-6 w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-[13px] leading-relaxed text-amber-800">
            Nếu lỗi vẫn tiếp diễn, vui lòng liên hệ đội ngũ CX phụ trách lớp học để được hỗ trợ.
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <SAPPButton
              title="Tải lại trang"
              onClick={handleReload}
              className="min-w-[150px] justify-center !border-red-600 !bg-red-600 !text-white [&>span]:!flex-none"
            />
            <SAPPButton
              title="Quay về LMS"
              onClick={handleBackToLms}
              className="min-w-[150px] justify-center [&>span]:!flex-none"
            />
          </div>
        </div>
      </div>
    </BaseModal>
  )
}

export default TamperWarning
