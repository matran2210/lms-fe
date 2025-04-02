import { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
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
import ExpandIcon from '../ExpandIcon'

const { Sider } = Layout

interface MenuItem {
  key: string
  icon: React.ReactNode
  link?: string
}

export default function TeacherMenu() {
  const [selectedKey, setSelectedKey] = useState<string>('Home')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(userReducer) // Lấy thông tin user đang đăng nhập
  const menuItems: MenuItem[] = [
    {
      key: 'Home',
      icon: <HomeMenuIcon selected={selectedKey === 'Home'} />,
      link: PageLink.TEACHERS,
    },
    {
      key: 'Book',
      icon: <BookMenuIcon selected={selectedKey === 'Book'} />,
      link: PageLink.TEACHER_MY_CLASS,
    },
    {
      key: 'Calender',
      icon: <CalenderMenuIcon selected={selectedKey === 'Calender'} />,
      link: PageLink.TEACHERS,
    },
    {
      key: 'File',
      icon: <FileMenuIcon selected={selectedKey === 'File'} />,
      link: PageLink.TEACHERS,
    },
    {
      key: 'Bell',
      icon: <BellIcon selected={selectedKey === 'Bell'} />,
      link: PageLink.TEACHERS,
    },
  ]
  const handleMenuClick = (item: { key: string }) => {
    if (selectedKey !== item.key) {
      const selectedItem = menuItems.find(
        (menuItem) => menuItem.key === item.key,
      )
      if (selectedItem?.link) {
        router.push(selectedItem.link)
      }
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
  useEffect(() => {
    if (router?.pathname) {
      const selectedItem = menuItems.find((menuItem) =>
        menuItem?.link?.includes(router.pathname),
      )
      setSelectedKey(selectedItem?.key || 'Home')
    }
  }, [router?.pathname])
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
        onSelect={(item) => handleMenuClick(item)}
        items={menuItems.map((item) => ({
          key: item.key,
          icon: item.icon,
          title: item.key,
        }))}
        className="flex w-12 flex-col items-center gap-6 [&_.ant-menu-item]:flex [&_.ant-menu-item]:w-fit [&_.ant-menu-item]:items-center [&_.ant-menu-item]:p-3"
      />
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
