import { Card } from 'antd'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'

interface IProps {
  title: React.ReactNode
  subtitle?: React.ReactNode
  className?: string
  bodyClassName?: string
  extra?: React.ReactNode
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void
}
const ProfileCard = ({
  className,
  bodyClassName,
  title,
  subtitle,
  children,
  extra,
  onScroll,
}: PropsWithChildren<IProps>) => {
  return (
    <Card
      title={
        <div className="mb-6 flex flex-col gap-2">
          <span className="text-xl font-semibold text-gray-14">{title}</span>
          {subtitle && (
            <span className="text-base font-normal text-gray-14">
              {subtitle}
            </span>
          )}
        </div>
      }
      variant="borderless"
      className={clsx('profile-card w-full !shadow-none', className)}
      extra={extra}
    >
      <div onScroll={onScroll} className={bodyClassName}>
        {children}
      </div>
    </Card>
  )
}

export default ProfileCard
