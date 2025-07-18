import { ShowLessIcon } from '@assets/icons'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'

interface FloatingCloseIconProps {
  open: boolean
  onClose: () => void
  drawerHeightVh?: number // chiều cao Drawer theo vh, mặc định 85
  iconSize?: number // px, mặc định 32
}

const FloatingCloseIcon: React.FC<FloatingCloseIconProps> = ({
  open,
  onClose,
  iconSize = 32,
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (open) {
      timeout = setTimeout(() => setShow(true), 300)
    } else {
      setShow(false)
    }
    return () => clearTimeout(timeout)
  }, [open])

  if (!open || !show) return null

  return ReactDOM.createPortal(
    <button
      onClick={onClose}
      style={{
        position: 'fixed',
        left: '48%',
        bottom: '388px',
        zIndex: 9999,
        borderRadius: '50%',
        width: iconSize,
        height: iconSize,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label="Đóng"
    >
      <ShowLessIcon size={iconSize} color="#1C274C" />
    </button>,
    document.body,
  )
}

export default FloatingCloseIcon
