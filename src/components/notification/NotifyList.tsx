import React, { useState } from 'react'
import Notify from './Notify'

interface NotifyLists {
  notifyLists: any[]
}

const NotifyList: React.FC<NotifyLists> = ({ notifyLists }) => {
  return (
    <>
      {notifyLists.map((notifyItem, index) => (
        <div key={index}>
          <Notify
            message={notifyItem.message}
            readStatus={notifyItem.readStatus}
            time={notifyItem.time}
          />
        </div>
      ))}
    </>
  )
}

export default NotifyList
