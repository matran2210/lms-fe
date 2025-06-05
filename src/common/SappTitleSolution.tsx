import clsx from 'clsx'
import React from 'react'

export const SappTitleSolution = ({
  title,
  className,
}: {
  title: string
  className?: string
}) => {
  return (
    <div className={clsx('text-base font-semibold text-[#050505]', className)}>
      {title}
    </div>
  )
}
