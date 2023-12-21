import { Dispatch, SetStateAction, useState } from 'react'
import Sidebar from '../Sidebar'

type DashboardLayoutProps = {
  mode: 'student' | 'teacher'
  children: React.ReactNode
  setOpenResource: Dispatch<SetStateAction<boolean>>
  openDrawer: boolean
}

export default function DashboardLayout({
  mode,
  children,
  setOpenResource,
  openDrawer
}: DashboardLayoutProps) {
  const [isOpened, setOpened] = useState(false)
  const toggleDrawer = () => {
    setOpened((prev) => !prev)
  }

  return (
    <div className="flex flex-nowrap">
      <Sidebar
        isOpened={isOpened}
        mode={mode}
        toggleDrawer={toggleDrawer}
        className={`fixed top-0 md:left-0 h-screen transition-all duration-200 ${openDrawer ? 'opacity-5' : ''} ${
          mode === 'student'
            ? 'bg-white shadow-sidebar w-20'
            : 'bg-bw-4 border-r border-dark w-[82px]'
        }`}
        setOpenResource={setOpenResource}
      />
      <div className="w-full min-h-screen">
        {/* <Header isOpened={isOpened} toggleDrawer={toggleDrawer} /> */}
        {/* <div> */}
        <div className="bg-gray-4 min-h-full ">
          <div className="ml-0 md:ml-20">{children}</div>
        </div>
        {/* </div> */}
        {/* <Footer /> */}
      </div>
    </div>
  )
}
