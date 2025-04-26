import { Tooltip as AntdTooltip, TooltipProps } from 'antd'

const Tooltip: React.FC<TooltipProps & { showTooltip?: boolean }> = ({
  showTooltip = true,
  children,
  color = '#404041',
  ...props
}) => {
  return showTooltip ? (
    <AntdTooltip color={color} {...props}>
      {children}
    </AntdTooltip>
  ) : (
    <>{children}</>
  )
}

export default Tooltip
