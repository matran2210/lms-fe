import { PageLink, TitleSidebar } from './index'

const MENU_OPTIONS: MenuOption[] = [
  /*{
    name: `${TitleSidebar.DASHBOARD}`,
    icon: 'home',
    url: `${PageLink.DASHBOARD}`,
  },*/
  {
    name: `${TitleSidebar.COURSES}`,
    icon: 'grid',
    url: `${PageLink.COURSES}`,
    type: 'level-1',
    subItems: [
      {
        name: `${TitleSidebar.COURSE_NEW}`,
        icon: 'document',
        url: `${PageLink.COURSE_NEW}`,
        type: 'level-2',
      },
      {
        name: `${TitleSidebar.COURSE_LIST}`,
        icon: 'document',
        url: `${PageLink.COURSES}`,
        type: 'level-2',
        subItems: [
          {
            name: `${TitleSidebar.TEACHER}`,
            icon: 'dot',
            url: `${PageLink.TEACHER}`,
            type: 'level-3',
          },
          {
            name: `${TitleSidebar.COURSE_LIST}`,
            icon: 'dot',
            url: `${PageLink.COURSES}`,
            type: 'level-3',
          },
        ],
      },
    ],
  },
  {
    name: `${TitleSidebar.TOPICS}`,
    icon: 'document',
    url: `${PageLink.TOPICS}`,
    type: 'level-1',
    subItems: [
      {
        name: `${TitleSidebar.TOPICS_LIST}`,
        icon: 'document',
        url: `${PageLink.TOPICS}`,
        type: 'level-2',
      },
      {
        name: `${TitleSidebar.CASE_STUDY}`,
        icon: 'document',
        url: `${PageLink.CASE_STUDY}`,
        type: 'level-2',
      },
    ],
  },
  {
    name: 'Resource',
    icon: 'learning-resource',
    url: '#',
    type: 'level-1',
  },
  {
    name: 'Entrance Test',
    icon: 'document',
    url: `${PageLink.ENTRANCE_TEST}`,
    type: 'level-1',
  },
]

const MENU_OPTIONS_BOTTOM: MenuOption[] = [
  {
    name: `${TitleSidebar.COURSES}`,
    icon: 'notification',
    url: `${PageLink.NOTIFICATION}`,
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.COURSES}`,
    icon: 'avatar',
    url: `${PageLink.DASHBOARD}`,
    type: 'level-1',
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
}

type MenuOption = {
  name: string
  icon: string
  url: string
  type: string
  subItems?: MenuOption[]
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
  }))
}

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS)
export const MENU_BOTTOM: MenuItem[] = makeMenuLevel(MENU_OPTIONS_BOTTOM)
