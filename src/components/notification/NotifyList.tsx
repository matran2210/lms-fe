import React, { useState } from 'react'
import NotifyItem from './NotifyItem'
import Icon from '@components/icons'

interface NotifyLists {
  notifyLists: any[]
}

const NotifyList: React.FC<NotifyLists> = ({ notifyLists }) => {
  return (
    <>
      {notifyLists.map((notifyItem, index) => {
        const readStatus = notifyItem?.readStatus
        return (
          <div
            key={index}
            className={`w-full p-6 pb-5 cursor-pointer relative ${
              readStatus ? 'bg-white' : 'bg-secondary'
            }`}
          >
            {!readStatus && (
              <Icon
                type="ellip"
                className="text-primary absolute left-2 top-1/2"
              />
            )}
            <h4
              className="text-base text-bw-1 mb-1"
              dangerouslySetInnerHTML={{ __html: notifyItem?.message }}
            ></h4>
            <p className="text-gray-1 text-medium-sm text-left">
              {notifyItem?.time} mins ago
            </p>
          </div>
        )
      })}
    </>
  )
}

export default NotifyList
