import { LANG_SIGNIN, TitleSidebar } from "@lms/core"
import { PageLink } from "./routes"
import { makeMenuLevel } from "@utils/helpers"


const MENU_OPTIONS: MenuOption[] = [
  {
    name: TitleSidebar.COURSES,
    icon: 'book-mark',
    url: PageLink.SHORT_COURSE,
    type: 'level-1',
  },
  {
    name: TitleSidebar.COURSE_CONTENT,
    icon: 'course-content',
    url: PageLink.SHORT_COURSE_DETAIL,
    type: 'level-1',
  },
  {
    name: TitleSidebar.ACTIVITY,
    icon: 'activity',
    url: PageLink.COURSE_ACTIVITY,
    type: 'level-1',
  },
  {
    name: TitleSidebar.NOTES_LIST,
    icon: 'notes-list',
    url: '#',
    type: 'level-1',
  },
  {
    name: TitleSidebar.RESOURCES,
    icon: 'learning-resource',
    url: '#',
    type: 'level-1',
  },
  {
    name: TitleSidebar.CALCULATOR,
    icon: 'caculator',
    url: '#',
    type: 'level-1',
  },
  {
    name: TitleSidebar.NEW_NOTE,
    icon: 'create-note',
    url: '#',
    type: 'level-1',
  },
]

const MENU_OPTIONS_EVENTTEST: MenuOption[] = [
  {
    name: LANG_SIGNIN.eventTest,
    icon: 'event-test',
    url: PageLink.EVENT_TEST,
    type: 'level-1',
  },
]

const MENU_OPTIONS_BOTTOM: MenuOption[] = [
  {
    name: `${TitleSidebar.NOTIFICATION}`,
    icon: 'notification',
    url: ``,
    type: 'level-1',
  },
  {
    name: ``,
    icon: 'avatar',
    url: `${PageLink.MYPROFILE}`,
    type: 'level-1',
  },
  {
    name: ``,
    icon: 'profile-detail',
    url: `${PageLink.MYPROFILE}`,
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

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS)
export const MENU_ITEMS_EVENT: MenuItem[] = makeMenuLevel(
  MENU_OPTIONS_EVENTTEST,
)
export const MENU_BOTTOM: MenuItem[] = makeMenuLevel(MENU_OPTIONS_BOTTOM)
