import clsx from 'clsx'
import React from 'react'

interface IProps {
  title: string
  onClick?: () => void
  isShow?: boolean
  className?: string
}
const ActionItem = ({
  title,
  onClick = () => {},
  isShow = false,
  className,
}: IProps) => {
  return (
    <div>
      {isShow && (
        <div className="cursor-pointer px-2 py-4 transition" onClick={onClick}>
          <div
            className={clsx(
              'px-3 py-2 text-sm font-medium text-gray-700',
              className,
            )}
          >
            {title}
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionItem
