import React from 'react'

const SAPPBorder = ({ className = 'mt-10' }: { className?: string }) => {
  return (
    <div
      className={`borderColor-default h-[0.0625rem] border-b ${className}`}
    ></div>
  )
}

export default SAPPBorder
