import React, { useState } from 'react'
import NotifySetting from './NotifySetting'

interface NotifyListSettings {
  notifyListsSettings: any[]
}

const NotifyListSetting: React.FC<NotifyListSettings> = ({
  notifyListsSettings,
}) => {
  return (
    <>
      {notifyListsSettings.map((notifyListItem, index) => (
        <div
          key={index}
          className="py-3 border-b border-gray-2 last:border-0 text-medium-sm text-bw-1"
        >
          <NotifySetting message={notifyListItem.message} />
        </div>
      ))}
    </>
  )
}

export default NotifyListSetting
