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
        <div key={index}>
          <NotifySetting message={notifyListItem.message} />
        </div>
      ))}
    </>
  )
}

export default NotifyListSetting
