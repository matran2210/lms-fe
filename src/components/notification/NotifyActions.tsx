import React, { useState } from 'react'

interface NotifyListSettings {
  notifyListsSettings: any[]
}

const NotifyActions: React.FC<NotifyListSettings> = ({
  notifyListsSettings,
}) => {
  return (
    <>
      {notifyListsSettings.map((notifyListItem, index) => (
        <div
          key={index}
          className="py-3 border-b border-gray-2 last:border-0 text-medium-sm text-bw-1"
        >
          <div>{notifyListItem.message}</div>
        </div>
      ))}
    </>
  )
}

export default NotifyActions
