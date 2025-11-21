import { Divider, Drawer } from 'antd'
import { useState } from 'react'
import MenuItemsList from '@components/courses/menu/MenuItemsList'
import { MENU_BOTTOM, MENU_ITEMS } from 'src/constants/sidebar'
import { LogoMobile } from '@components/courses/icons'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { HamburgerMenuLargeIcon } from '@lms/assets'

export default function SidebarMobile() {
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()

  const toggleDrawer = () => {
    setOpen(!open)
  }

  const listPathHiddenSidebar = [
    '/short-course/detail/[courseId]/activity/[id]',
  ]

  const isInMyProfile = router.pathname === '/overview'
  return (
    <>
      {/* Top bar with hamburger and title */}
      <div
        className={clsx(
          'h-12 w-12 items-center justify-center rounded-lg bg-white p-2 shadow-small md:h-14 md:w-14 lg:hidden',
          {
            hidden:
              listPathHiddenSidebar.includes(router.pathname) && !isInMyProfile,
            flex:
              !listPathHiddenSidebar.includes(router.pathname) &&
              !isInMyProfile,
            'hidden md:flex': isInMyProfile,
          },
        )}
        onClick={toggleDrawer}
      >
        <HamburgerMenuLargeIcon />
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
            <div className="group-logos mx-auto px-5">
              <div className="flex h-[50px] items-end justify-center text-center">
                <LogoMobile />
              </div>
            </div>
            {/* Divider */}
            <div className="mx-auto w-[calc(100%-48px)] text-center">
              <Divider className="my-6 bg-[#DCDDDD]" />
            </div>
            {/* Menu Items */}
            <MenuItemsList
              options={MENU_ITEMS}
              closeSideBar={toggleDrawer}
              isVisible
            />
          </div>
          <div>
            <div className="mx-auto w-[calc(100%-48px)] bg-[#DCDDDD] text-center">
              <Divider className="mb-8 mt-0 bg-[#DCDDDD]" />
            </div>
            <MenuItemsList
              options={MENU_BOTTOM}
              closeSideBar={toggleDrawer}
              isVisible
            />

            {/* <TabButton
              items={itemButtonTab}
              className="!rounded !px-1 !py-2 text-ssm"
            /> */}
          </div>
        </div>
      </Drawer>
    </>
  )
}
