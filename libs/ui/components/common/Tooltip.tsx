import { Tooltip as AntdTooltip, ConfigProvider } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { ReactNode } from "react";

export const DEFAULT_TOOLTIP_BG_COLOR = "#404041";
export const DEFAULT_TOOLTIP_COLOR = "#FFF";

interface ITooltip {
  showTooltip?: boolean;
  color?: string;
  children: ReactNode;
  title: ReactNode;
  placement?: TooltipPlacement;
  className?: string;
  arrow?: boolean;
  rootClassName?: string;
}

const Tooltip: React.FC<ITooltip> = ({
  showTooltip = true,
  children,
  color = DEFAULT_TOOLTIP_BG_COLOR,
  title,
  className,
  placement = "top",
  arrow,
  rootClassName,
}) => {
  if (!showTooltip) {
    return <span className={className}>{children}</span>;
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
        open={true}
        color={color}
        placement={placement}
        className={className}
        arrow={arrow}
        rootClassName={`sapp-tooltip ${rootClassName || ""}`}
      >
        {children}
      </AntdTooltip>
    </ConfigProvider>
  );
};

export default Tooltip;
