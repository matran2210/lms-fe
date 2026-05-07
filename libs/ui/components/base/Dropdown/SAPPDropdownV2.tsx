import { PepIconsPencil } from "@lms/assets";
import { Dropdown } from "antd";
import React from "react";
import { Placement } from "@lms/core";

interface DropdownAction {
  key?: string;
  label: React.ReactNode;
  onClick?: () => void;
  show?: boolean;
}

interface SAPPDropdownProps {
  actions: DropdownAction[];
  icon?: React.ReactNode;
  trigger?: ("click" | "hover" | "contextMenu")[];
  placement?: Placement;
}

const SAPPDropdownV2 = ({
  actions,
  icon,
  trigger = ["click"],
  placement = "bottomLeft",
}: SAPPDropdownProps) => {
  const items = actions
    .filter((item) => item.show)
    .map((action, index) => ({
      key: action.key ?? index,
      label: action.label,
      onClick: action.onClick,
    }));

  return (
    <Dropdown
      menu={{ items }}
      trigger={trigger}
      placement={placement}
      overlayClassName="w-[150px]"
    >
      <div className="cursor-pointer">{icon ?? <PepIconsPencil />}</div>
    </Dropdown>
  );
};

export default SAPPDropdownV2;
