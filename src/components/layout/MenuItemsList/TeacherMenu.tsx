import { useEffect, useMemo, useState, useCallback, Fragment } from 'react'
import { Layout, Menu, Tooltip } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  HomeMenuIcon,
  BookMenuIcon,
  FileMenuIcon,
  BellIcon,
  HelpMenuIcon,
  LogOutMenuIcon,
  MyCalendarMenuIcon,
  MyCourseTeacherIcon,
} from 'src/assets/icons'
import blankAvatar from '@assets/images/blank_avatar.webp'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { useAppSelector, useAppDispatch } from 'src/redux/hook'
import { userReducer } from 'src/redux/slice/User/User'
import { activeNotesList, pushNotes } from 'src/redux/slice/Course/NotesList'
import { PageLink, TitleSidebar, TitleTeacherSidebar } from 'src/constants'
import ExpandIcon from 'src/components/layout/ExpandIcon'
import LearningResource from 'src/components/mycourses/LearningResource'
import { v4 as uuidv4 } from 'uuid'
import { openCalculator } from 'src/redux/slice/Course/MyCourse/Activity/Activity'
import { IUser } from 'src/redux/types/User/urser'
import { useCourseContext } from '@contexts/index'
import clsx from 'clsx'
const { Sider } = Layout

export default function TeacherMenu({
  isCourseDetail,
  isActivity,
}: {
  isCourseDetail: boolean
  isActivity: boolean
}) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector(userReducer)

  const [selectedKey, setSelectedKey] = useState('Home')
  const [openResource, setOpenResource] = useState(false)
  const { showPinnedTrial } = useCourseContext()
  const isCurrent = useCallback(
    (path: string | string[]) =>
      Array.isArray(path)
        ? path.includes(router.pathname)
        : router.pathname === path,
    [router.pathname],
  )

  const handleLogout = useCallback(async () => {
    try {
      await new AuthenticationManager().logout()
    } catch {}
  }, [])

  const actionHandlers: Record<string, () => void> = {
    [TitleSidebar.NOTES_LIST]: () => {
      dispatch(activeNotesList())
      document.body.style.overflow = 'hidden'
    },
    [TitleSidebar.RESOURCES]: () => {
      setOpenResource(true)
      document.body.style.overflow = 'hidden'
    },
    [TitleSidebar.NEW_NOTE]: () => {
      dispatch(
        pushNotes({ uuid: uuidv4(), id: '', name: 'Note', description: '' }),
      )
    },
    [TitleSidebar.CALCULATOR]: () => dispatch(openCalculator()),
  }

  const getMenuItems = useCallback(() => {
    if (isCourseDetail || isActivity) {
      const baseItems = [
        {
          key: TitleSidebar.COURSE_CONTENT,
          title: TitleSidebar.COURSE_CONTENT,
          icon: (
            <HomeMenuIcon
              selected={selectedKey === TitleSidebar.COURSE_CONTENT}
            />
          ),
          link: `${PageLink.TEACHER_MY_COURSE}/my-course/${router.query.id || router.query.courseId}`,
          active:
            isCurrent(`${PageLink.TEACHERS}${PageLink.COURSE_DETAIL}`) &&
            selectedKey !== TitleSidebar.NOTES_LIST,
        },
        {
          key: TitleSidebar.NOTES_LIST,
          title: TitleSidebar.NOTES_LIST,
          icon: (
            <BookMenuIcon selected={selectedKey === TitleSidebar.NOTES_LIST} />
          ),
          link: '#',
          active: selectedKey === TitleSidebar.NOTES_LIST,
        },
        {
          key: TitleSidebar.RESOURCES,
          title: TitleSidebar.RESOURCES,
          icon: (
            <FileMenuIcon selected={selectedKey === TitleSidebar.RESOURCES} />
          ),
          link: '#',
          active: selectedKey === TitleSidebar.RESOURCES,
        },
        {
          key: TitleSidebar.RESULTS,
          title: TitleSidebar.RESULTS,
          icon: (
            <MyCourseTeacherIcon
              selected={selectedKey === TitleSidebar.RESULTS}
            />
          ),
          link: `${PageLink.TEACHER_MY_COURSE}/my-course/${router.query.id || router.query.courseId}/results`,
          active: isCurrent(
            `${PageLink.TEACHER_MY_COURSE}/my-course/${router.query?.id ? '[id]' : '[courseId]'}/results`,
          ),
        },
      ]

      if (isActivity) {
        baseItems.push(
          {
            key: TitleSidebar.NEW_NOTE,
            title: TitleSidebar.NEW_NOTE,
            icon: (
              <MyCalendarMenuIcon
                selected={selectedKey === TitleSidebar.NEW_NOTE}
              />
            ),
            link: '#',
            active: selectedKey === TitleSidebar.NEW_NOTE,
          },
          {
            key: TitleSidebar.CALCULATOR,
            title: TitleSidebar.CALCULATOR,
            icon: (
              <BellIcon selected={selectedKey === TitleSidebar.CALCULATOR} />
            ),
            link: '#',
            active: selectedKey === TitleSidebar.CALCULATOR,
          },
        )
      }
      return baseItems
    }

    return [
      {
        key: 'Home',
        title: TitleTeacherSidebar.DASHBOARD,
        icon: <HomeMenuIcon selected={selectedKey === 'Home'} />,
        link: PageLink.TEACHERS,
        active: isCurrent(PageLink.TEACHERS),
      },
      {
        key: 'MyCourse',
        title: TitleSidebar.COURSES,
        icon: <MyCourseTeacherIcon selected={selectedKey === 'MyCourse'} />,
        link: PageLink.TEACHER_MY_COURSE,
        active: isCurrent(PageLink.TEACHER_MY_COURSE),
      },
      {
        key: 'Book',
        title: TitleTeacherSidebar.MYCLASS,
        icon: <BookMenuIcon selected={selectedKey === 'Book'} />,
        link: PageLink.TEACHER_MY_CLASS,
        active: isCurrent([
          PageLink.TEACHER_MY_CLASS,
          `${PageLink.TEACHER_MY_CLASS}/[id]`,
          PageLink.TEACHER_CHAPTER_TEST,
        ]),
      },
      {
        key: 'MyCalendar',
        title: TitleTeacherSidebar.MYCALENDAR,
        icon: <MyCalendarMenuIcon selected={selectedKey === 'MyCalendar'} />,
        link: PageLink.MY_CALENDAR,
        active: isCurrent(PageLink.MY_CALENDAR),
      },
      {
        key: 'File',
        title: TitleTeacherSidebar.MYREQUEST,
        icon: <FileMenuIcon selected={selectedKey === 'File'} />,
        link: PageLink.TEACHER_MY_REQUEST,
        active: isCurrent(PageLink.TEACHER_MY_REQUEST),
      },
      {
        key: 'Bell',
        title: TitleTeacherSidebar.NOTIFICATIONS,
        icon: <BellIcon selected={selectedKey === 'Bell'} />,
        link: PageLink.TEACHERS,
        active: isCurrent(PageLink.TEACHERS),
      },
    ]
  }, [isCourseDetail, isActivity, selectedKey, router.query, isCurrent])

  const menuItems = useMemo(() => getMenuItems(), [getMenuItems])

  useEffect(() => {
    setSelectedKey((prevKey) => {
      if (prevKey === 'Home' || prevKey === '') {
        return menuItems.find((item) => item.active)?.key ?? 'Home'
      }
      return prevKey
    })
  }, [menuItems])

  const handleMenuClick = ({ key }: { key: string }) => {
    if (actionHandlers[key]) {
      actionHandlers[key]()
    } else {
      const target = menuItems.find((item) => item.key === key)
      if (target?.link) router.push(target.link)
    }
    if (key !== selectedKey) setSelectedKey(key)
  }

  return (
    <Fragment>
      <Sider
        width={80}
        collapsed
        className={clsx(
          'fixed bottom-0 left-0 top-0 flex h-screen flex-col items-center bg-blue-2',
          showPinnedTrial && 'pt-[54px]',
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <SidebarMenu
            items={menuItems}
            selectedKey={selectedKey}
            onClick={handleMenuClick}
          />
          <BottomActionMenu user={user} onLogout={handleLogout} />
        </div>
      </Sider>
      <LearningResource open={openResource} setOpenResource={setOpenResource} />
    </Fragment>
  )
}

const SidebarMenu = ({
  items,
  selectedKey,
  onClick,
}: {
  items: {
    key: string
    title: string
    icon: React.ReactNode
    link: string
    active: boolean
  }[]
  selectedKey: string
  onClick: (key: { key: string }) => void
}) => (
  <div className="flex flex-col items-center">
    <div className="mb-8 mt-6 h-10 w-10 cursor-pointer">
      <ExpandIcon type="teacher-logo-full" />
    </div>
    <div className="mb-7 h-[1.2px] w-8 bg-white" />
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      className="flex w-12 flex-col items-center gap-6 [&_.ant-menu-item]:p-3"
    >
      {items.map((item) => (
        <Tooltip
          key={item.key}
          title={item.title}
          placement="right"
          overlayClassName="teacher-sidebar-tooltip"
        >
          <Menu.Item
            key={item.key}
            icon={item.icon}
            onClick={() => onClick({ key: item.key })}
          />
        </Tooltip>
      ))}
    </Menu>
  </div>
)

const BottomActionMenu = ({
  user,
  onLogout,
}: {
  user: IUser
  onLogout: () => void
}) => (
  <div className="mb-6 flex flex-col items-center gap-6">
    <Link href={PageLink.MYPROFILE}>
      <Image
        alt="avatar"
        src={
          user?.detail?.avatar['32x32'] ||
          user?.detail?.avatar['ORIGIN'] ||
          blankAvatar
        }
        width={32}
        height={32}
        className="cursor-pointer rounded-full object-cover"
      />
    </Link>
    <div className="cursor-pointer p-2">
      <HelpMenuIcon />
    </div>
    <div className="cursor-pointer p-2" onClick={onLogout}>
      <LogOutMenuIcon />
    </div>
  </div>
)
