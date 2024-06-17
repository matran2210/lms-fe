import { PageLink, TitleSidebar } from './index'

const MENU_OPTIONS: MenuOption[] = [
  // {
  //   name: `${TitleSidebar.DASHBOARD}`,
  //   icon: 'grid',
  //   url: PageLink.DASHBOARD,
  //   type: 'level-1',
  // },
  {
    name: `${TitleSidebar.COURSES}`,
    icon: 'course',
    url: `${PageLink.COURSES}`,
    type: 'level-1',
    ga: 'Click Menu My Course',
    // subItems: [
    //   {
    //     name: `${TitleSidebar.COURSE_NEW}`,
    //     icon: 'document',
    //     url: `${PageLink.COURSE_NEW}`,
    //     type: 'level-2',
    //   },
    //   {
    //     name: `${TitleSidebar.COURSE_LIST}`,
    //     icon: 'document',
    //     url: `${PageLink.COURSES}`,
    //     type: 'level-2',
    //     subItems: [
    //       {
    //         name: `${TitleSidebar.TEACHER}`,
    //         icon: 'dot',
    //         url: `${PageLink.TEACHER}`,
    //         type: 'level-3',
    //       },
    //       {
    //         name: `${TitleSidebar.COURSE_LIST}`,
    //         icon: 'dot',
    //         url: `${PageLink.COURSES}`,
    //         type: 'level-3',
    //       },
    //     ],
    //   },
    // ],
  },
  // {
  //   name: `${TitleSidebar.DASHBOARD}`,
  //   icon: 'stats-chart-sharp',
  //   url: PageLink.DASHBOARD,
  //   type: 'level-1',
  // },
  {
    name: `${TitleSidebar.NOTES_LIST}`,
    icon: 'notes-list',
    url: '#',
    type: 'level-1',
    ga: 'Click Menu Note List',
  },
  {
    name: `${TitleSidebar.RESOURCES}`,
    icon: 'learning-resource',
    url: '#',
    type: 'level-1',
    ga: 'Click Menu Learning Resource',
  },
  {
    name: `${TitleSidebar.ENTRANCE_TEST}`,
    icon: 'entrance-test',
    url: `${PageLink.ENTRANCE_TEST}`,
    type: 'level-1',
    ga: 'Click Menu Entrance Test',
  },
  // {
  //   name: `${TitleSidebar.RESULTS}`,
  //   icon: 'result',
  //   url: '/',
  //   type: 'level-1',
  // },
  {
    name: `${TitleSidebar.NEW_NOTE}`,
    icon: 'create-note',
    url: '#',
    type: 'level-1',
    ga: 'Click Menu Create Note',
  },
  {
    name: `${TitleSidebar.CALCULATOR}`,
    icon: 'caculator',
    url: '#',
    type: 'level-1',
    ga: 'Click Menu Canculator',
  },
]

const MENU_OPTIONS_BOTTOM: MenuOption[] = [
  {
    name: `${TitleSidebar.NOTIFICATION}`,
    icon: 'notification',
    url: `${PageLink.NOTIFICATION}`,
    type: 'level-1',
    ga: 'Click Menu Notification',
  },
  {
    name: ``,
    icon: 'avatar',
    url: `${PageLink.MYPROFILE}`,
    type: 'level-1',
    ga: 'Click Menu My Profile',
  },
  {
    name: ``,
    icon: 'profile-detail',
    url: `${PageLink.MYPROFILE}`,
    type: 'level-1',
    ga: 'Click Menu Profile Detail',
  },
]

export type MenuItem = {
  name: string
  icon: string
  url: string
  type?: string
  id: string
  depth: number
  subItems?: MenuItem[]
  ga?: string
}

type MenuOption = {
  name: string
  icon: string
  url: string
  type: string
  subItems?: MenuOption[]
  id?: string
  ga?: string
}

function makeMenuLevel(options: MenuOption[], depth = 0): MenuItem[] {
  return options.map((option, idx) => ({
    ...option,
    id: depth === 0 ? idx.toString() : `${depth}.${idx}`,
    depth,
    subItems:
      option.subItems && option.subItems.length > 0
        ? makeMenuLevel(option.subItems, depth + 1)
        : undefined,
    ga: option?.ga,
  }))
}

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS)
export const MENU_BOTTOM: MenuItem[] = makeMenuLevel(MENU_OPTIONS_BOTTOM)
