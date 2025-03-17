import { useState } from 'react'
import {
  HomeOutlined,
  BookOutlined,
  FileOutlined,
  BellOutlined,
  UserOutlined,
  AppstoreOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import { Layout, Menu, Tooltip } from 'antd'
import Image from 'next/image'
import sapp from 'src/assets/images/sapp_menu.svg'
import { HelpIcon } from 'src/assets/icons/index'
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
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: 'inbox',
      icon: <BookOutlined />,
      label: 'Inbox',
    },
    {
      key: 'files',
      icon: <FileOutlined />,
      label: 'Files',
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
    },
    {
      key: 'apps',
      icon: <AppstoreOutlined />,
      label: 'Applications',
    },
  ]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      trigger={null}
      width={200}
      className={`h-screen ${className || ''}`}
      style={{
        overflow: 'auto',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#0f172a',
      }}
    >
      <div className="flex h-full flex-col justify-between py-4">
        <div>
          {/* Logo */}
          <div className="flex items-center justify-center py-4">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image alt="Logo" src={sapp} className="sapp-h-45px" />
            </div>
          </div>

          {/* Main Menu */}
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{
              backgroundColor: 'transparent',
              borderRight: 0,
              marginTop: '16px',
            }}
            onSelect={({ key }) => handleMenuClick(key)}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: collapsed ? (
                <Tooltip placement="right" title={item.label}>
                  <span
                    style={{
                      color: selectedKey === item.key ? '#facc15' : 'white',
                      transition: 'color 0.3s',
                    }}
                  >
                    {item.icon}
                  </span>
                </Tooltip>
              ) : (
                <span
                  style={{
                    color: selectedKey === item.key ? '#facc15' : 'white',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.icon}
                </span>
              ),
              label: collapsed ? null : (
                <span
                  style={{
                    color: selectedKey === item.key ? '#facc15' : 'white',
                    transition: 'color 0.3s',
                  }}
                >
                  {item.label}
                </span>
              ),
            }))}
          />
        </div>

        {/* User Profile */}
        <div className="flex flex-col items-center justify-center pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600">
            <UserOutlined style={{ color: 'white' }} />
          </div>
          <div className="mt-3 flex h-8 w-8 items-center justify-center">
            <QuestionCircleOutlined style={{ color: 'white' }} />
          </div>
        </div>
      </div>
    </Sider>
  )
}
