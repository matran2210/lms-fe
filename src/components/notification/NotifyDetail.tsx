import React, { useState, Dispatch, SetStateAction } from 'react'
import Icon from '@components/icons'
import blankAvatar from '@assets/images/blank_avatar.webp'
import Image from 'next/image'
import { calculateTimeAgo } from '@utils/helpers'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  notifyDetail: any
}

const NotifyDetail = ({ notifyDetail }: IProps) => {
  const dispatch = useAppDispatch()
  return (
    <div key={notifyDetail?.id} className="w-full">
      <div
        className="text-bw-1"
        dangerouslySetInnerHTML={{ __html: notifyDetail?.content }}
      ></div>
    </div>
  )
}

export default NotifyDetail
