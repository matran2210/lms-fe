'use client'

import { Modal } from 'antd'
import type { ModalProps } from 'antd'

const MAX_Z_INDEX = 2147483647

/**
 * Modal dùng chung cho lms-zoom, gói antd Modal với cấu hình mặc định:
 * - centered, footer ẩn, bo góc + ẩn padding để tự kiểm soát layout dạng "card".
 * - mask tối + blur.
 * - getContainer={false}: render TRONG #zoom-app (không portal ra <body>). Bắt buộc
 *   vì Tailwind ở app này dùng `important: '#zoom-app'` nên utility chỉ áp dụng cho
 *   phần tử nằm trong #zoom-app — nếu portal ra body thì class Tailwind sẽ không lên.
 *
 * Mọi prop của antd Modal đều có thể override (truyền sau phần default).
 */
const BaseModal = ({ children, styles, ...props }: ModalProps) => {
  return (
    <Modal
      centered
      footer={null}
      getContainer={false}
      zIndex={MAX_Z_INDEX}
      width={460}
      {...props}
      styles={{
        mask: { background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)' },
        content: { padding: 0, borderRadius: 16, overflow: 'hidden' },
        ...styles,
      }}
    >
      {children}
    </Modal>
  )
}

export default BaseModal
