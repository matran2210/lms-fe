import React, { useState, Dispatch, SetStateAction } from 'react'
import Icon from '@components/icons'

interface IProps {
  notifyLists: any[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const NotifyList = ({ notifyLists, open, setOpen }: IProps) => {
  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <>
      {notifyLists.map((notifyItem, index) => {
        const readStatus = notifyItem?.notification_user_instances?.is_read
        return (
          <div
            key={notifyItem?.id}
            className={`w-full p-6 pb-5 cursor-pointer relative ${
              readStatus ? 'bg-white' : 'bg-secondary'
            }`}
            onClick={() => handleOpen()}
          >
            {!readStatus && (
              <Icon
                type="ellip"
                className="text-primary absolute left-2 top-1/2"
              />
            )}
            <h4
              className="text-base text-bw-1 mb-1"
              dangerouslySetInnerHTML={{ __html: notifyItem?.title }}
            ></h4>
            <p className="text-gray-1 text-medium-sm text-left">
              {notifyItem?.updated_at} mins ago
            </p>
          </div>
        )
      })}
    </>
  )
}

export default NotifyList
