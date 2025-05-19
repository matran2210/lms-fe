import { Card } from 'antd'
import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'

interface IProps {
  title: string
  className?: string
  extra?: React.ReactNode
}
const ProfileCard = ({
  className,
  title,
  children,
  extra,
}: PropsWithChildren<IProps>) => {
  return (
    <Card
      title={title}
      variant="borderless"
      className={clsx('profile-card w-full !shadow-none', className)}
      extra={extra}
    >
      {children}
    </Card>
  )
}

export default ProfileCard
