import { Dispatch, SetStateAction } from "react";


export type MenuItem = {
  name: string;
  icon: string;
  url: string;
  type?: string;
  id: string;
  depth: number;
  subItems?: MenuItem[];
};

export type MenuOption = {
  name: string;
  icon: string;
  url: string;
  type: string;
  subItems?: MenuOption[];
};

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
