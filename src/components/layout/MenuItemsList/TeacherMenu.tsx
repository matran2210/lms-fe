import { useEffect, useMemo, useState } from 'react'
import { Layout, Menu, Tooltip } from 'antd'
import Image from 'next/image'
import { userReducer } from 'src/redux/slice/User/User'

import {
  HomeMenuIcon,
  BookMenuIcon,
  CalenderMenuIcon,
  FileMenuIcon,
  BellIcon,
  HelpMenuIcon,
  LogOutMenuIcon,
  MyCalendarMenuIcon,
} from 'src/assets/icons/index'

import blankAvatar from '@assets/images/blank_avatar.webp'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import { NOTIFICATION_STATUS } from 'src/type'
import Link from 'next/link'
import { PageLink, TitleTeacherSidebar } from 'src/constants'
import ExpandIcon from 'src/components/layout/ExpandIcon/index'

const { Sider } = Layout

interface MenuItem {
  key: string
  icon: React.ReactNode
  link: string
  active: boolean
}

export default function TeacherMenu() {
  const [selectedKey, setSelectedKey] = useState<string>('Home')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer) // Lấy thông tin user đang đăng nhập

  const menuItems = useMemo(
    () => [
      {
        key: 'Home',
        icon: <HomeMenuIcon selected={selectedKey === 'Home'} />,
        link: PageLink.TEACHERS,
        active: router.pathname === PageLink.TEACHERS,
        title: TitleTeacherSidebar?.DASHBOARD,
      },
      {
        key: 'Book',
        icon: <BookMenuIcon selected={selectedKey === 'Book'} />,
        link: PageLink.TEACHER_MY_CLASS,
        active: [
          PageLink.TEACHER_MY_CLASS,
          `${PageLink.TEACHER_MY_CLASS}/[id]`,
          PageLink.TEACHER_CHAPTER_TEST,
        ].includes(router.pathname),
        title: TitleTeacherSidebar?.MYCLASS,
      },
      // {
      //   key: 'Calender',
      //   icon: <CalenderMenuIcon selected={selectedKey === 'Calender'} />,
      //   link: PageLink.TEACHERS,
      //   active: router.pathname === PageLink.TEACHERS,
      //   title: TitleTeacherSidebar?.CALENDAR,
      // },
      {
        key: 'MyCalendar',
        icon: <MyCalendarMenuIcon selected={selectedKey === 'MyCalendar'} />,
        link: PageLink.MY_CALENDAR,
        active: router.pathname === PageLink.MY_CALENDAR,
        title: TitleTeacherSidebar?.MYCALENDAR,
      },
      {
        key: 'File',
        icon: <FileMenuIcon selected={selectedKey === 'File'} />,
        link: PageLink.TEACHER_MY_REQUEST,
        active: router.pathname === PageLink.TEACHER_MY_REQUEST,
        title: TitleTeacherSidebar?.MYREQUEST,
      },
      {
        key: 'Bell',
        icon: <BellIcon selected={selectedKey === 'Bell'} />,
        link: PageLink.TEACHERS,
        active: router.pathname === PageLink.TEACHERS,
        title: TitleTeacherSidebar?.NOTIFICATIONS,
      },
    ],
    [selectedKey, router.pathname],
  )

  const handleMenuClick = (item: { key: string }) => {
    if (selectedKey !== item.key) {
      const selectedItem = menuItems.find(
        (menuItem) => menuItem.key === item.key, // Khi chọn icon trên thanh menu điều hướng đến trang phù hợp
      )
      if (selectedItem?.link) {
        router.push(selectedItem.link)
      }
    }
  }

  const handleLogout = async () => {
    // Hàm đăng xuất
    try {
      // Gọi phương thức `logout()` của AuthenticationManager, chuyển hướng về trang gốc sau khi đăng xuất
      const authenticationManager = new AuthenticationManager()
      await authenticationManager.logout()
    } catch (error) {}
  }

  useEffect(() => {
    const updateSelectedKey = () => {
      const activeItem = menuItems.find((menuItem) => menuItem.active) // Find the active menu item
      setSelectedKey(activeItem?.key ?? 'Home') // Update selectedKey, default to 'Home' if not found
    }

    updateSelectedKey()
  }, [menuItems]) // Re-run effect when menuItems changes

  const ItemMenu = ({
    icon,
    action,
  }: {
    icon: React.ReactNode
    action?: () => void
  }) => (
    <div className="cursor-pointer p-2" onClick={action}>
      {icon}
    </div>
  )

  const ItemMenuLink = () => (
    <div className="flex flex-col items-center">
      {/* Logo */}
      <div className="mb-8 mt-6 flex items-center justify-center">
        <div className="flex h-10 w-10 cursor-pointer items-center justify-center">
          <ExpandIcon type={'teacher-logo-full'} />
        </div>
      </div>
      <div className="mb-7 h-[1.20px] w-8 bg-white"></div>
      {/* Main Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        className="flex w-12 flex-col items-center gap-6 [&_.ant-menu-item]:flex [&_.ant-menu-item]:w-fit [&_.ant-menu-item]:items-center [&_.ant-menu-item]:p-3"
      >
        {menuItems.map((item) => (
          <Tooltip
            key={item.key}
            title={item.title}
            overlayClassName="teacher-sidebar-tooltip"
            placement="right"
          >
            <Menu.Item
              key={item.key}
              icon={item.icon}
              className="p-3"
              onClick={() => handleMenuClick(item)}
            />
          </Tooltip>
        ))}
      </Menu>
    </div>
  )

  const BottomMenu = () => (
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
      <ItemMenu icon={<HelpMenuIcon />} />
      <ItemMenu icon={<LogOutMenuIcon />} action={handleLogout} />
    </div>
  )

  return (
    <Sider
      width={80}
      collapsed
      className="fixed bottom-0 left-0 top-0 flex h-screen flex-col items-center overflow-auto bg-blue-2"
    >
      <div className="flex h-full flex-col items-center justify-between">
        <ItemMenuLink />
        <BottomMenu />
      </div>
    </Sider>
  )
}
