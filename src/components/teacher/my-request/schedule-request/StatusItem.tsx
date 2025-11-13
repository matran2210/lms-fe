import { capitalizeFirstLetter } from '@utils/index'
import clsx from 'clsx'
import React from 'react'

interface IProps {
  status: string
  className?: string
}
const StatusItem = ({ status, className = '' }: IProps) => {
  return (
    <span
      className={clsx(`rounded-[4px] px-2 py-1 text-xs font-medium`, className)}
    >
      {capitalizeFirstLetter(status)}
    </span>
  )
}

export default StatusItem
