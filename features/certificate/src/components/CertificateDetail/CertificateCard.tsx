import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'

interface IProps {
  className?: string
  bodyClassName?: string
}
const CertificateCard = ({
  children,
  className,
  bodyClassName,
}: PropsWithChildren<IProps>) => {
  return (
    <div
      className={clsx(
        `certificate-card-wrapper relative h-screen w-screen`,
        className,
      )}
    >
      <div className={'absolute inset-0 bg-white/25'} />
      <div className={clsx('relative z-10 flex h-full', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}

export default CertificateCard
