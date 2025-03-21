import { useState } from 'react'
import { Layout, Menu } from 'antd'
import Image from 'next/image'
import sapp from 'src/assets/images/sapp_menu.svg'
import {
  HomeMenuIcon,
  BookMenuIcon,
  CalenderMenuIcon,
  FileMenuIcon,
  BellIcon,
  HelpMenuIcon,
  LogOutMenuIcon,
} from 'src/assets/icons/index'
import { AuthenticationManager } from '@utils/helpers/keycloak'
import { getLocalStorageItem, removeLocalStorageItem } from '@utils/index'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/redux/hook'
import { getLogoutUser } from 'src/redux/slice/Login/Login'
import { NOTIFICATION_STATUS } from 'src/type'
import Link from 'next/link'

const { Sider } = Layout
interface SidebarMenuProps {
  className?: string
}

export default function SidebarMenu({ className }: SidebarMenuProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKey, setSelectedKey] = useState('home')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const handleMenuClick = (item: any) => {
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

  const menuItems = [
    {
      key: 'home',
      icon: <HomeMenuIcon selected={selectedKey === 'home'} />,
      link: '/teacher',
    },
    {
      key: 'book',
      icon: <BookMenuIcon selected={selectedKey === 'book'} />,
      link: '/teacher/my-class',
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

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      width={80}
      className={`sidebar-left flex h-screen flex-col items-center ${className || ''}`}
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#091D37',
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
              label: '',
            }))}
            className="[&_.ant-menu-item]:flex [&_.ant-menu-item]:w-fit [&_.ant-menu-item]:items-center"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              gap: 24,
            }}
          />
        </div>
        {/* Bottom Menu */}
        <div className="mb-6 flex flex-col items-center gap-6">
          <Link href="/overview">
            <Image
              alt="avatar"
              src={sapp}
              width={32}
              height={32}
              className="cursor-pointer rounded-full p-2"
            />
          </Link>
          <div className="cursor-pointer p-2">
            <HelpMenuIcon />
          </div>
          <div className="cursor-pointer p-2" onClick={handleLogout}>
            <LogOutMenuIcon />
          </div>
        </div>
      </div>
    </Sider>
  )
}
