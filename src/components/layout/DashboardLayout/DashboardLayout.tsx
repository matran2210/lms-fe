import { useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'

type DashboardLayoutProps = {
  mode: 'student' | 'teacher'
  children: React.ReactNode
}

export default function DashboardLayout({
  mode,
  children,
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
        className={`fixed top-0 md:left-0 h-screen z-30 transition-all duration-200 ${
          mode === 'student'
            ? 'bg-white shadow-sidebar w-20 py-2.5'
            : 'bg-bw-4 border-r border-dark w-[82px] pt-8 pb-10'
        }`}
      />
      <div className="w-full md:pl-20">
        <Header isOpened={isOpened} toggleDrawer={toggleDrawer} />
        <div>
          <div>{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
