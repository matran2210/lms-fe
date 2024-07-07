import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Sidebar from '../Sidebar'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { getPinnedNotifications, userReducer } from 'src/redux/slice/User/User'

type DashboardLayoutProps = {
  children: React.ReactNode
  setOpenResource: Dispatch<SetStateAction<boolean>>
  openDrawer: boolean
}

export default function DashboardLayout({
  children,
  setOpenResource,
  openDrawer,
}: DashboardLayoutProps) {
  const [isOpened, setOpened] = useState(false)
  const dispatch = useAppDispatch()
  const toggleDrawer = () => {
    setOpened((prev) => !prev)
  }
  const guideStatus = useAppSelector((state) => state.userGuideReducer?.status)
  const user = useAppSelector(userReducer)

  useEffect(() => {
    dispatch(getPinnedNotifications())
  }, [])

  return (
    <div className={` flex flex-nowrap`}>
      <Sidebar
        isOpened={isOpened}
        toggleDrawer={toggleDrawer}
        className={`menu-sidebar-left fixed top-0 md:left-0 h-screen bg-white shadow-sidebar w-20 max-w-screen ${
          openDrawer ? 'opacity-5' : ''
        } ${guideStatus ? '' : 'overflow-hidden'} ${user?.user?.username && user?.pinnedNotifications?.data?.content ? 'pt-12' : ''}`}
        setOpenResource={setOpenResource}
      />
      <div className="w-full min-h-screen">
        {/* <Header isOpened={isOpened} toggleDrawer={toggleDrawer} /> */}
        {/* <div> */}
        <div className="bg-gray-4 min-h-full ">
          <div className="ml-0 md:ml-20 sapp-loading">{children}</div>
        </div>
        {/* </div> */}
        {/* <Footer /> */}
      </div>
    </div>
  )
}
