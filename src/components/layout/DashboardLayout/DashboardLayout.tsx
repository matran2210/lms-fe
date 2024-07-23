import { Dispatch, SetStateAction, useState } from 'react'
import Sidebar from '../Sidebar'
import { useAppSelector } from 'src/redux/hook'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'

type DashboardLayoutProps = {
  children: React.ReactNode
  setOpenResource?: Dispatch<SetStateAction<boolean>>
  openDrawer?: boolean
}

export default function DashboardLayout({
  children,
  openDrawer,
}: DashboardLayoutProps) {
  const [isOpened, setOpened] = useState(false)
  const toggleDrawer = () => {
    setOpened((prev) => !prev)
  }
  const { openPinned, pinnedNotifications } = usePinnedNotifyContext()

  const guideStatus = useAppSelector(
    (state: { userGuideReducer: { status: any } }) =>
      state.userGuideReducer?.status,
  )

  const [openResource, setOpenResource] = useState(false)

  return (
    <div className="flex flex-nowrap">
      <Sidebar
        isOpened={isOpened}
        toggleDrawer={toggleDrawer}
        className={`menu-sidebar-left fixed top-0 md:left-0 h-screen bg-white shadow-sidebar w-20 max-w-screen ${
          openDrawer ? 'opacity-5' : ''
        } ${guideStatus ? '' : 'overflow-hidden'} ${openPinned && pinnedNotifications?.data?.content ? 'pt-12' : ''}`}
        setOpenResource={setOpenResource}
        openResource={openResource}
      />
      <div className="w-full min-h-screen">
        {/* <Header isOpened={isOpened} toggleDrawer={toggleDrawer} /> */}
        {/* <div> */}
        <div
          className={`${openPinned && pinnedNotifications?.data?.content ? 'pt-12' : ''} bg-gray-4 min-h-full`}
        >
          <div className="ml-0 md:ml-20 sapp-loading">{children}</div>
        </div>
        {/* </div> */}
        {/* <Footer /> */}
      </div>
    </div>
  )
}
