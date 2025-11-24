import React, { useState } from 'react'
import { Icon } from '@lms/assets'
import { ReactNode } from 'react'
import { Tooltip } from 'antd'
import clsx from 'clsx'

interface actionCellProps {
  icon?: ReactNode
  className?: string
  listAction?: {
    icon: ReactNode
    nameAction: string
    action: () => void
  }[]
}

const ActionCellV2 = ({
  icon = <Icon type="pencil" />,
  className,
  listAction,
}: actionCellProps) => {
  const [open, setOpen] = useState(false)
  const classNames = clsx('flex cursor-pointer items-center gap-2 p-1', {
    className,
  })

  return (
    <Tooltip
      trigger="click"
      placement="left"
      onOpenChange={(visible) => setOpen(visible)}
      title={
        <div className="flex flex-col gap-2">
          {listAction?.map((item) => (
            <div
              className={classNames}
              key={item.nameAction}
              onClick={(e) => {
                e.stopPropagation()
                item.action()
                setOpen(false)
              }}
            >
              {item.icon}
              <span className="text-sm font-normal leading-snug text-white">
                {item.nameAction}
              </span>
            </div>
          ))}
        </div>
      }
      color="#404041"
      open={open}
    >
      <div className="cursor-pointer">{icon}</div>
    </Tooltip>
  )
}

export default ActionCellV2
