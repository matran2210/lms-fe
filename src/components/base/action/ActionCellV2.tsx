import React, { useState } from 'react'
import Icon from '@components/icons'
import { ReactNode } from 'react'
import { Tooltip } from 'antd'
import clsx from 'clsx'

interface actionCellProps {
  icon?: ReactNode
  nameAction: string
  action: () => void
  className?: string
}

const ActionCellV2 = ({
  icon,
  nameAction,
  action,
  className,
}: actionCellProps) => {
  const [open, setOpen] = useState(false)
  const classNames = clsx(
    'flex cursor-pointer items-center gap-2 text-sm font-normal leading-snug text-white',
    {
      className,
    },
  )

  return (
    <Tooltip
      trigger="click"
      onOpenChange={(visible) => setOpen(visible)}
      title={
        <div
          className={classNames}
          onClick={(e) => {
            e.stopPropagation()
            action()
            setOpen(false)
          }}
        >
          {icon}
          {nameAction}
        </div>
      }
      color="#404041"
      placement="left"
      open={open}
    >
      <div className="cursor-pointer">
        <Icon type="pencil" />
      </div>
    </Tooltip>
  )
}

export default ActionCellV2
