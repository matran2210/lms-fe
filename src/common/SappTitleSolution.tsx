import clsx from 'clsx'
import React from 'react'

export const SappTitleSolution = ({
  title,
  className = '',
}: {
  title: string
  className?: string
}) => {
  return (
    <div className={clsx('text-base font-bold text-bw-black-2', className)}>
      {title}
    </div>
  )
}
