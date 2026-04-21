import Image from 'next/image'
import React from 'react'
import { useFeature, userReducer } from '@lms/contexts'
import clsx from 'clsx'
import { BlankAvatarImage } from '@lms/assets'

interface IProps {
  className?: string
  onClick?: () => void
  description?: React.ReactNode
  isShowType?: boolean
}
const AvatarCard = ({
  className,
  onClick,
  description,
  isShowType = true,
}: IProps) => {
  const { useAppSelector } = useFeature()
  const { user } = useAppSelector?.(userReducer) || {}
  return (
    <div className={clsx('flex items-center', className)} onClick={onClick}>
      <div className="h-10 w-10 shrink-0">
        {user?.detail?.avatar?.['40x40'] || user?.detail.avatar?.['ORIGIN'] ? (
          <Image
            src={
              user?.detail.avatar?.['40x40'] || user?.detail.avatar?.['ORIGIN']
            }
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover"
            width={40}
            height={40}
          />
        ) : (
          <Image
              src={BlankAvatarImage}
            alt="avatar"
            className="rounded-full"
            width={40}
            height={40}
            priority={true}
          />
        )}
      </div>
      <div
        className={`label avatar pl-4 text-base font-normal text-gray-800 transition-all duration-150 group-hover:text-white`}
      >
        <div className="line-clamp-1 text-base font-semibold text-gray-800 group-hover:text-white">
          {user?.detail?.full_name}
        </div>
        {description && (
          <div className="line-clamp-1 text-sm font-normal lowercase text-[#A1A1A1] group-hover:text-white">
            {description}
          </div>
        )}
        {isShowType && (
          <div className="line-clamp-1 text-sm font-normal capitalize text-[#A1A1A1] group-hover:text-white">
            {user?.type?.toLowerCase()}
          </div>
        )}
      </div>
    </div>
  )
}

export default AvatarCard
