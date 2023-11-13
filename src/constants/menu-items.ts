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
    subItems: [
      {
        name: `${TitleSidebar.COURSE_NEW}`,
        icon: 'dot',
        url: `${PageLink.COURSE_NEW}`,
      },
      {
        name: `${TitleSidebar.COURSE_LIST}`,
        icon: 'dot',
        url: `${PageLink.COURSES}`,
      },
    ],
  },
  {
    name: `${TitleSidebar.TOPICS}`,
    icon: 'document',
    url: `${PageLink.TOPICS}`,
    subItems: [
      {
        name: `${TitleSidebar.TOPICS_LIST}`,
        icon: 'dot',
        url: `${PageLink.TOPICS}`,
      },
      {
        name: `${TitleSidebar.CASE_STUDY}`,
        icon: 'dot',
        url: `${PageLink.CASE_STUDY}`,
      },
    ],
  },
]

export type MenuItem = {
  name: string
  icon: string
  url: string
  id: string
  depth: number
  subItems?: MenuItem[]
}

type MenuOption = {
  name: string
  icon: string
  url: string
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
