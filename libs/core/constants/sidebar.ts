import { makeMenuLevel } from "@utils/helpers";
import { PageLink, TitleSidebar } from ".";
import { LANG_SIGNIN } from "./lang";
import { Dispatch, SetStateAction } from "react";

const MENU_OPTIONS: MenuOption[] = [
  // {
  //   name: `${TitleSidebar.DASHBOARD}`,
  //   icon: 'union',
  //   url: '#',
  //   type: 'level-1',
  // },
  {
    name: `${TitleSidebar.COURSE_CONTENT}`,
    icon: "course-content",
    url: `${PageLink.SHORT_COURSE_DETAIL}`,
    type: "level-1",
  },
  {
    name: `${TitleSidebar.COURSES}`,
    icon: "book-mark",
    url: `${PageLink.SHORT_COURSE}`,
    type: "level-1",
  },
  {
    name: `${TitleSidebar.NOTES_LIST}`,
    icon: "note-list",
    url: "#",
    type: "level-1",
  },
  {
    name: `${TitleSidebar.COURSE_RESOURCES}`,
    icon: "outline-archive",
    url: "#",
    type: "level-1",
  },
  {
    name: `${TitleSidebar.CALCULATOR}`,
    icon: "calculator",
    url: "#",
    type: "level-1",
  },
  {
    name: `${TitleSidebar.ADD_NOTE}`,
    icon: "add-note",
    url: "#",
    type: "level-1",
  },
];

const MENU_OPTIONS_EVENTTEST: MenuOption[] = [
  {
    name: LANG_SIGNIN.eventTest,
    icon: "event-test",
    url: PageLink.EVENT_TEST,
    type: "level-1",
  },
];

const MENU_OPTIONS_BOTTOM: MenuOption[] = [
  {
    name: `${TitleSidebar.NOTIFICATION}`,
    icon: "notification",
    url: `${PageLink.NOTIFICATION}`,
    type: "level-1",
  },
  {
    name: ``,
    icon: "avatar",
    url: `${PageLink.MYPROFILE}`,
    type: "level-1",
  },
  {
    name: ``,
    icon: "profile-detail",
    url: `${PageLink.MYPROFILE}`,
    type: "level-1",
  },
];

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

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS);
export const MENU_ITEMS_EVENT: MenuItem[] = makeMenuLevel(
  MENU_OPTIONS_EVENTTEST,
);
export const MENU_BOTTOM: MenuItem[] = makeMenuLevel(MENU_OPTIONS_BOTTOM);
