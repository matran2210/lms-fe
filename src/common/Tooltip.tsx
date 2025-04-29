import { Tooltip as AntdTooltip, ConfigProvider, TooltipProps } from 'antd'

export const DEFAULT_TOOLTIP_BG_COLOR = '#ffffff'
export const DEFAULT_TOOLTIP_COLOR = '#000000'

const Tooltip: React.FC<TooltipProps & { showTooltip?: boolean }> = ({
  showTooltip = true,
  children,
  color = DEFAULT_TOOLTIP_BG_COLOR,
  ...props
}) => {
  if (!showTooltip) return <div>{children}</div>

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextLightSolid: DEFAULT_TOOLTIP_COLOR,
          colorText: DEFAULT_TOOLTIP_COLOR,
        },
      }}
    >
      <AntdTooltip color={color} {...props}>
        {children}
      </AntdTooltip>
    </ConfigProvider>
  )
}

export default Tooltip
