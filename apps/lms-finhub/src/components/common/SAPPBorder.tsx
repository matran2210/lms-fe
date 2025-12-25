import React from 'react'

const SAPPBorder = ({ className = 'mt-10' }: { className?: string }) => {
  return (
    <div className={`borderColor-default h-[1px] border-b ${className}`}></div>
  )
}

export default SAPPBorder
