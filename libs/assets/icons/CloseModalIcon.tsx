import React from 'react'

export const CloseModalIcon = ({ className }: { className?: string }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className={className}>
      <path
        stroke="#1C274C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M18 18 6 6M6 18 18 6"
      />
    </svg>
  )
}

export default CloseModalIcon
