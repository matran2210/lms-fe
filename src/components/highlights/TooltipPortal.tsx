import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'

interface TooltipPortalProps {
  children: ReactNode
  position: { top: number; left: number } | null
}

export const TooltipPortal: React.FC<TooltipPortalProps> = ({
  children,
  position,
}) => {
  if (!position) return null

  return ReactDOM.createPortal(
    <div
      className="fixed z-50 rounded-lg"
      style={{
        top: position.top,
        left: position.left,
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        userSelect: 'none',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
