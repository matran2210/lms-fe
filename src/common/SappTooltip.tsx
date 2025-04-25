import { Tooltip } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import React, { ReactNode } from 'react'

interface IProps {
  title: React.JSX.Element | string
  children?: ReactNode
  placement?: TooltipPlacement | undefined
  showTooltip: boolean
}

const SappTooltip = ({
  title,
  children,
  placement = 'bottom',
  showTooltip,
}: IProps) => {
  return (
    <React.Fragment>
      {showTooltip ? (
        <Tooltip title={title} placement={placement}>
          {children}
        </Tooltip>
      ) : (
        <>{children}</>
      )}
    </React.Fragment>
  )
}

export default SappTooltip
