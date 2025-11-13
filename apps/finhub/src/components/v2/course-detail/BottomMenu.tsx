import clsx from 'clsx'
import React, { PropsWithChildren } from 'react'

interface IProps {
  className?: string
}
const BottomMenu = ({ children, className }: PropsWithChildren<IProps>) => {
  return (
    <div
      className={clsx(
        'fixed bottom-8 left-1/2 mx-auto w-max max-w-sm -translate-x-1/2 transform lg:hidden',
        className,
      )}
    >
      <div className="flex justify-center gap-5 rounded-xl bg-primary px-4 py-2 shadow-card md:gap-0 md:px-6">
        {children}
      </div>
    </div>
  )
}

export default BottomMenu
