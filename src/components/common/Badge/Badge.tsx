import React from 'react'

const Badge = ({ badge, className }: { badge: string; className: string }) => {
  return (
    <div
      className={`flex w-fit items-center justify-center rounded px-2 py-0.5 text-sm md:mb-3 ${className}`}
    >
      {badge}
    </div>
  )
}

export default Badge
