import React, { useState, Dispatch, SetStateAction } from 'react'
import Icon from '@components/icons'
import blankAvatar from '@assets/images/blank_avatar.webp'
import Image from 'next/image'
import { calculateTimeAgo } from '@utils/helpers'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  notifyLists: any[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  getApiNotificationDetail: (id: string) => void
}

const NotifyList = ({
  notifyLists,
  open,
  setOpen,
  getApiNotificationDetail,
}: IProps) => {
  const dispatch = useAppDispatch()
  const handleOpen = async (id: string) => {
    setOpen(!open)
    await getApiNotificationDetail(id)
  }

  return (
    <>
      {notifyLists.map((notifyItem, index) => {
        const readStatus = notifyItem?.notification_user_instances?.is_read
        return (
          <div
            key={notifyItem?.id}
            className={`w-full p-6 pb-5 cursor-pointer relative flex items-center gap-4 ${
              readStatus ? 'bg-white' : 'bg-secondary'
            }`}
            onClick={() => {
              handleOpen(notifyItem?.id)
            }}
          >
            {!readStatus && (
              <Icon
                type="ellip"
                className="text-primary absolute left-2 top-1/2"
              />
            )}
            <div className="shrink-0">
              <Image
                src={notifyItem?.avatar?.ORIGIN ?? blankAvatar}
                alt="avatar"
                className="rounded-full"
                width={56}
                height={56}
                layout="fixed"
                objectFit={'cover'}
              />
            </div>
            <div className="block">
              <h4
                className="text-base text-bw-1 mb-1"
                dangerouslySetInnerHTML={{ __html: notifyItem?.title }}
              ></h4>
              <p className="text-gray-1 text-medium-sm text-left">
                {calculateTimeAgo(notifyItem?.updated_at)}
              </p>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default NotifyList
