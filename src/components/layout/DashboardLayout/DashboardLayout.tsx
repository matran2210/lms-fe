import { useState } from 'react'
import Footer from '../Footer'
import Header from '../Header'
import Sidebar from '../Sidebar'

type DashboardLayoutProps = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpened, setOpened] = useState(false)
  const toggleDrawer = () => {
    setOpened((prev) => !prev)
  }

  return (
    <div className="flex flex-nowrap">
      <Sidebar
        isOpened={isOpened}
        className="w-20 bg-white px-5 shadow-sidebar overflow-hidden"
      />
      <div className="w-full">
        <Header isOpened={isOpened} toggleDrawer={toggleDrawer} />
        <div>
          <div>{children}</div>
        </div>
        <Footer />
      </div>
    </div>
  )
}
