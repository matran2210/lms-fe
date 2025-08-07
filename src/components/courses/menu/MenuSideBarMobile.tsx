import { Drawer } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { useState } from 'react'
import MenuItemsList from '@components/courses/menu/MenuItemsList'
import { IButtonTab } from 'src/type/courses-3-level/button'
import {
  MENU_BOTTOM,
  MENU_ITEMS,
  SidebarMobileProps,
} from 'src/constants/courses3level/sidebar'
import { LogoMobile } from '@components/courses/icons'
import TabButton from '@components/courses/buttons/TabButton'
import RedirectModal from '../popup/RedirectModal'
import { useStaticModalContext } from '@contexts/StaticModalContext'
import { useRouter } from 'next/router'

export default function SidebarMobile({
  setOpenResource,
  openResource,
}: SidebarMobileProps) {
  const [open, setOpen] = useState<boolean>(false)
  const { setVisibleRedirectModal } = useStaticModalContext()
  const router = useRouter()

  const itemButtonTab: IButtonTab[] = [
    {
      title: 'Master Finance',
      onClick: () => {
        toggleDrawer()
        setVisibleRedirectModal(false)
      },
      active: true,
    },
    {
      title: 'General Course',
      onClick: () => {
        toggleDrawer()
        setVisibleRedirectModal(true)
      },
    },
  ]

  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
    <>
      {/* Top bar with hamburger and title */}
      <div
        className={`m-4 ${router.pathname === '/short-course/detail/[courseId]/activity/[id]' ? 'hidden' : 'flex'} items-center justify-between rounded-md bg-white px-4 py-3 shadow-search md:hidden`}
      >
        <MenuOutlined onClick={toggleDrawer} className="text-xl" />
        <span className="text-lg font-medium">
          Welcome to{' '}
          <span className="font-semibold text-primary">Master Finance</span>
        </span>
        <div />
      </div>

      {/* Sidebar Drawer */}
      <Drawer
        placement="left"
        closable={false}
        onClose={toggleDrawer}
        open={open}
        width={220}
        rootClassName="sidebar-3lv-mobile"
      >
        <div className="flex h-full flex-col justify-between px-2.5 py-6">
          <div>
            {/* Logo */}
            <div className="group-logos mx-auto h-[71px] px-5 pb-5.25">
              <div className="flex h-[50px] items-end justify-center text-center">
                <LogoMobile />
              </div>
            </div>
            {/* Menu Items */}
            <MenuItemsList
              options={MENU_ITEMS}
              setOpenResource={setOpenResource}
              closeSideBar={toggleDrawer}
            />
          </div>
          <div>
            <MenuItemsList
              options={MENU_BOTTOM}
              setOpenResource={setOpenResource}
              closeSideBar={toggleDrawer}
            />

            <TabButton
              items={itemButtonTab}
              className="!rounded !px-1 !py-2 text-ssm"
            />
          </div>
        </div>
      </Drawer>
      <RedirectModal />
    </>
  )
}
