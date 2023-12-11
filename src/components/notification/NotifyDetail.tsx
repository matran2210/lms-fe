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
      <div className="w-full relative flex items-center border-b border-default pb-5">
        <Image
          src={blankAvatar}
          alt="avatar"
          className="rounded-full"
          width={56}
          height={56}
          layout="fixed"
          objectFit={'cover'}
        />
        <div className="block pl-5">
          <h4
            className="text-base text-bw-1 mb-1"
            dangerouslySetInnerHTML={{ __html: notifyDetail?.title }}
          ></h4>
          <p className="text-gray-1 text-medium-sm text-left">
            {calculateTimeAgo(notifyDetail?.updated_at)}
          </p>
        </div>
      </div>
      <div
        className="pt-5"
        dangerouslySetInnerHTML={{ __html: notifyDetail?.content }}
      ></div>
    </div>
  )
}

export default NotifyDetail
