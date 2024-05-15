import React from 'react'

const SAPPBorder = ({ className = 'mt-10' }: { className?: string }) => {
  return (
    <div className={`h-[1px] border-b borderColor-default ${className}`}></div>
  )
}

export default SAPPBorder
