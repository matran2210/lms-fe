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
    <div className={`certificate-card-wrapper relative h-screen w-screen`}>
      <div className={clsx('absolute inset-0 bg-white/25', className)} />
      <div className={clsx('relative z-10 flex h-full', bodyClassName)}>
        {children}
      </div>
    </div>
  )
}

export default CertificateCard
