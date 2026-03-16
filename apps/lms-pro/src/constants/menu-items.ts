import { MenuItem, MenuOption, ProfilePages, TitleSidebar } from '@lms/core'
import { PageLink } from './routers'
import { LANG_SIGNIN } from '@lms/core'
import { makeMenuLevel } from '@lms/utils'

const MENU_OPTIONS: MenuOption[] = [
  {
    name: `${TitleSidebar.DASHBOARD}`,
    icon: 'grid',
    url: PageLink.DASHBOARD,
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.COURSES}`,
    icon: 'course',
    url: `${PageLink.COURSES}`,
    type: 'level-1',
  },
  {
    name: TitleSidebar.COURSE_ACTIVATION,
    icon: 'course-activation',
    url: PageLink.COURSE_ACTIVATION,
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.COURSE_CONTENT}`,
    icon: 'bookmark',
    url: `${PageLink.COURSE_CONTENT}`,
    type: 'level-2',
  },
  {
    name: `${TitleSidebar.NOTES_LIST}`,
    icon: 'notes-list',
    url: '#',
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.RESOURCES}`,
    icon: 'learning-resource',
    url: '#',
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.CLASS_RESOURCE}`,
    icon: 'class-resource',
    url: `${PageLink.CLASS_RESOURCE}`,
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.ENTRANCE_TEST}`,
    icon: 'entrance-test',
    url: `${PageLink.ENTRANCE_TEST}`,
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.RESULTS}`,
    icon: 'result',
    url: PageLink.RESULTS,
    type: 'level-2',
  },
  {
    name: `${TitleSidebar.NEW_NOTE}`,
    icon: 'create-note',
    url: '#',
    type: 'level-1',
  },
  {
    name: `${TitleSidebar.CALCULATOR}`,
    icon: 'calculator',
    url: '#',
    type: 'level-1',
  },
  {
    name: TitleSidebar.CALENDAR,
    icon: 'calendar',
    url: PageLink.CALENDAR,
    type: 'level-1',
  },
  {
    name: TitleSidebar.EXAM_LIST,
    icon: 'exam_list',
    url: `/${ProfilePages.ExamList}`,
    type: 'level-1',
  },
  {
    name: TitleSidebar.EXAM,
    icon: 'exam-information',
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
    url: '',
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

export const MENU_ITEMS: MenuItem[] = makeMenuLevel(MENU_OPTIONS)
export const MENU_ITEMS_EVENT: MenuItem[] = makeMenuLevel(
  MENU_OPTIONS_EVENTTEST,
)
export const MENU_BOTTOM: MenuItem[] = makeMenuLevel(MENU_OPTIONS_BOTTOM)
