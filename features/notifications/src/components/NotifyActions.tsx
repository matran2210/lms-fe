import React from 'react'

const NotifyActions = ({ handleMarkAll }: { handleMarkAll: () => void }) => {
  return (
    <div
      className="border-b border-[#DCDDDD] py-3 text-sm text-[#050505] last:border-0"
      onClick={handleMarkAll}
    >
      <div className="cursor-pointer">Mark all as read</div>
    </div>
  )
}

export default NotifyActions
