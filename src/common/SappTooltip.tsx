import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import React, { ReactNode } from 'react'

interface IProps {
  title: string
  children: ReactNode
  placement?: TooltipPlacement | undefined
}

const SappTooltip = ({ title, children, placement = 'bottom' }: IProps) => {
  return (
    <Tooltip title={title} placement={placement} color="white">
      {children}
    </Tooltip>
  )
}

export default SappTooltip
