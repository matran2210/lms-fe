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
    <div className={clsx('text-bw-black-2 text-base font-bold', className)}>
      {title}
    </div>
  )
}
