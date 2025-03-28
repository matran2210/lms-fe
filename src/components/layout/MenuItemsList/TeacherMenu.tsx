import { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import Image from 'next/image'
import sapp from 'src/assets/images/sapp_menu.svg'
import { userReducer } from 'src/redux/slice/User/User'

import {
  HomeMenuIcon,
  BookMenuIcon,
  CalenderMenuIcon,
  FileMenuIcon,
  BellIcon,
  HelpMenuIcon,
  LogOutMenuIcon,
} from 'src/assets/icons/index'

import blankAvatar from '@assets/images/blank_avatar.webp'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import { NOTIFICATION_STATUS } from 'src/type'
import Link from 'next/link'
import { PageLink } from 'src/constants'

const { Sider } = Layout

interface MenuItem {
  key: string
  icon: React.ReactNode
  link?: string
}

export default function TeacherMenu() {
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKey, setSelectedKey] = useState('home')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer)
  const handleMenuClick = (item: { key: string }) => {
    const selectedItem = menuItems.find((menuItem) => menuItem.key === item.key)
    setSelectedKey(item.key)
    if (selectedItem?.link) {
      router.push(selectedItem.link)
    }
  }
  const handleLogout = async () => {
    try {
      await dispatch(getLogoutUser()).then(() => {
        const pinnedStatus = getLocalStorageItem('pinnedStatus')
        if (pinnedStatus === NOTIFICATION_STATUS.SHOWING) {
          removeLocalStorageItem('pinnedId')
        }
      })
      const authenticationManager = new AuthenticationManager()
      await authenticationManager.logout(window.location.origin)
    } catch (error) {}
  }

  const menuItems: MenuItem[] = [
    {
      key: 'home',
      icon: <HomeMenuIcon selected={selectedKey === 'home'} />,
      link: '/teacher',
    },
    {
      key: 'book',
      icon: <BookMenuIcon selected={selectedKey === 'book'} />,
      link: PageLink.TEACHER_MY_CLASS,
    },
    {
      key: 'calender',
      icon: <CalenderMenuIcon selected={selectedKey === 'calender'} />,
      link: '/',
    },
    {
      key: 'file',
      icon: <FileMenuIcon selected={selectedKey === 'file'} />,
    },
    {
      key: 'bell',
      icon: <BellIcon selected={selectedKey === 'bell'} />,
    },
  ]

  useEffect(() => {
    if (router.pathname.includes(PageLink.TEACHER_MY_CLASS)) {
      setSelectedKey('book')
    }
  }, [router.pathname])

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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      width={80}
      className="sidebar-left flex h-screen flex-col items-center bg-blue-2"
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div className="flex h-full flex-col items-center justify-between">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-8 mt-6 flex items-center justify-center">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image alt="Logo" src={sapp} className="sapp-h-45px" />
            </div>
          </div>
          <div className="mb-7 h-[1.20px] w-8 bg-white"></div>
          {/* Main Menu */}
          <Menu
            defaultSelectedKeys={['home']}
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            onSelect={(item) => handleMenuClick(item)}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: item.icon,
              title: item.key,
            }))}
            className="flex w-12 flex-col items-center gap-6 [&_.ant-menu-item]:flex [&_.ant-menu-item]:w-fit [&_.ant-menu-item]:items-center [&_.ant-menu-item]:p-3"
          />
        </div>
        {/* Bottom Menu */}
        <div className="mb-6 flex flex-col items-center gap-6">
          <Link href={PageLink.MYPROFILE}>
            <Image
              alt="avatar"
              src={
                user.detail.avatar['32x32'] ||
                user.detail.avatar['ORIGIN'] ||
                blankAvatar
              }
              width={32}
              height={32}
              className="cursor-pointer rounded-full p-2"
            />
          </Link>
          <ItemMenu icon={<HelpMenuIcon />} />
          <ItemMenu icon={<LogOutMenuIcon />} action={handleLogout} />
        </div>
      </div>
    </Sider>
  )
}
