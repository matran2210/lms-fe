import { Dispatch, SetStateAction } from "react";
import { MenuItem } from "../types";


export type MenuItemProps = {
  menuItem: MenuItem;
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  closeSideBar: () => void;
  isVisible?: boolean;
};

export type MenuItemsListProps = {
  options: MenuItem[];
  setOpenResource?: Dispatch<SetStateAction<boolean>>;
  closeSideBar: () => void;
};

export type SidebarProps = {
  isOpened: boolean;
  className: string;
  toggleDrawer: () => void;
  openExaminationInfo?: boolean;
  setOpenExaminationInfo?: Dispatch<SetStateAction<boolean>>;
};

export type SidebarMobileProps = {
  setOpenResource: Dispatch<SetStateAction<boolean>>;
  openResource: boolean;
};
