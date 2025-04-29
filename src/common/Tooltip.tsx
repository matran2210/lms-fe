import { Tooltip as AntdTooltip, ConfigProvider } from 'antd'
import { TooltipPlacement } from 'antd/es/tooltip'
import { ReactNode } from 'react'

export const DEFAULT_TOOLTIP_BG_COLOR = '#ffffff'
export const DEFAULT_TOOLTIP_COLOR = '#000000'

interface ITooltip {
  showTooltip?: boolean
  color?: string
  children: ReactNode
  title: ReactNode
  placement?: TooltipPlacement
}

const Tooltip: React.FC<ITooltip> = ({
  showTooltip = true,
  children,
  color = DEFAULT_TOOLTIP_BG_COLOR,
  title,
  placement = 'top',
}) => {
  if (!showTooltip) {
    return <div>{children}</div>
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextLightSolid: DEFAULT_TOOLTIP_COLOR,
          colorText: DEFAULT_TOOLTIP_COLOR,
        },
      }}
    >
      <AntdTooltip title={title} color={color} placement={placement}>
        {children}
      </AntdTooltip>
    </ConfigProvider>
  )
}

export default Tooltip
