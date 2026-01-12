import { Icon } from "@lms/assets";
import { Popover } from "antd";
import clsx from "clsx";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Placement, arrowClassMap, arrowRotationMap } from "./placement";
import { tooltipMotionByPlacement } from "./tooltip.motion";

interface ActionItem {
  icon: ReactNode;
  nameAction: string;
  action: () => void;
}

interface ActionCellV2Props {
  icon?: ReactNode;
  className?: string;
  listAction?: ActionItem[];
  placement?: Placement;
}

const ActionCellV2 = ({
  icon = <Icon type="pencil" />,
  className,
  listAction = [],
  placement = "left",
}: ActionCellV2Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      trigger="click"
      placement={placement}
      open={open}
      onOpenChange={setOpen}
      destroyTooltipOnHide
      overlayClassName="sapp-action-popover"
      content={
        <AnimatePresence>
          {open && (
            <motion.div
              key="action-menu"
              {...tooltipMotionByPlacement(placement)}
              className={clsx(
                "relative rounded-md bg-[#404041] px-3 py-2 text-white shadow-large",
                className,
              )}
            >
              <span
                className={clsx(
                  "absolute h-2 w-4 bg-[#404041]",
                  arrowClassMap[placement],
                  arrowRotationMap[placement],
                  "[clip-path:polygon(50%_100%,0_0,100%_0)]",
                )}
              />

              {/* ACTION LIST */}
              <div className="flex flex-col gap-2">
                {listAction.map((item) => (
                  <div
                    key={item.nameAction}
                    className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 "
                    onClick={(e) => {
                      e.stopPropagation();
                      item.action();
                      setOpen(false);
                    }}
                  >
                    {item.icon}
                    <span className="text-sm leading-snug">
                      {item.nameAction}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      }
    >
      <div className="cursor-pointer">{icon}</div>
    </Popover>
  );
};

export default ActionCellV2;
