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
const { Sider } = Layout
interface SidebarMenuProps {
  className?: string
}

export default function SidebarMenu({ className }: SidebarMenuProps) {
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKey, setSelectedKey] = useState('home')

  const handleMenuClick = (key: string) => {
    setSelectedKey(key)
  }

  const menuItems = [
    {
      key: 'home',
      icon: <HomeMenuIcon selected={selectedKey === 'home'} />,
    },
    {
      key: 'book',
      icon: <BookMenuIcon selected={selectedKey === 'book'} />,
    },
    {
      key: 'calender',
      icon: <CalenderMenuIcon selected={selectedKey === 'calender'} />,
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
            onSelect={({ key }) => handleMenuClick(key)}
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
          <div>
            <Image
              alt="avatar"
              src={sapp}
              width={32}
              height={32}
              className="cursor-pointer rounded-full p-2"
            />
          </div>
          <div className="cursor-pointer p-2">
            <HelpMenuIcon />
          </div>
          <div className="cursor-pointer p-2">
            <LogOutMenuIcon />
          </div>
        </div>
      </div>
    </Sider>
  )
}
