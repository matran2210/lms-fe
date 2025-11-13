import { Tooltip as AntdTooltip, ConfigProvider } from 'antd'
import {
  DEFAULT_TOOLTIP_BG_COLOR,
  DEFAULT_TOOLTIP_COLOR,
} from 'src/constants/courses'
import { ITooltip } from 'src/type/courses-3-level'

export default function TooltipCourses({
  showTooltip = true,
  children,
  color = DEFAULT_TOOLTIP_BG_COLOR,
  title,
  className,
  placement = 'top',
  arrow,
}: ITooltip) {
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
      <AntdTooltip
        title={title}
        color={color}
        placement={placement}
        className={className}
        arrow={arrow}
      >
        {children}
      </AntdTooltip>
    </ConfigProvider>
  )
}
