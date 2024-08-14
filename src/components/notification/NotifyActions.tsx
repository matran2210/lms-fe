import React from 'react'

const NotifyActions = ({ handleMarkAll }: { handleMarkAll: () => void }) => {
  return (
    <div
      className="border-b border-gray-2 py-3 text-medium-sm text-bw-1 last:border-0"
      onClick={handleMarkAll}
    >
      <div className="cursor-pointer">Mark all as read</div>
    </div>
  )
}

export default NotifyActions
