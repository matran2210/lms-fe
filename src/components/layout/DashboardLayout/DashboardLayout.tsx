import { Dispatch, SetStateAction, useState } from 'react'
import Sidebar from '../Sidebar'
import { useAppSelector } from 'src/redux/hook'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { PageLink } from 'src/constants'
import { useRouter } from 'next/router'
import { useCourseContext } from '@contexts/index'

type DashboardLayoutProps = {
  children: React.ReactNode
  setOpenResource?: Dispatch<SetStateAction<boolean>>
  openDrawer?: boolean
}

export default function DashboardLayout({
  children,
  openDrawer,
}: DashboardLayoutProps) {
  const router = useRouter()
  const [isOpened, setOpened] = useState(false)
  const toggleDrawer = () => setOpened((prev) => !prev)

  const { openPinned, pinnedNotifications } = usePinnedNotifyContext()
  const { showPinnedTrial } = useCourseContext()

  const guideStatus = useAppSelector(
    (state: { userGuideReducer: { status: any } }) =>
      state.userGuideReducer?.status,
  )

  const [openResource, setOpenResource] = useState(false)

  const isEnablePinnedPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  let paddingTop = '';

  if (isEnablePinnedPages && openPinned && pinnedNotifications?.data?.content) {
    paddingTop = showPinnedTrial ? 'pt-[112px]' : 'pt-12';
  } else if (showPinnedTrial) {
    paddingTop = 'pt-[64px]';
  }


  return (
    <div className="flex flex-nowrap">
      <Sidebar
        isOpened={isOpened}
        toggleDrawer={toggleDrawer}
        className={`menu-sidebar-left max-w-screen fixed top-0 h-screen w-20 bg-white shadow-sidebar md:left-0 ${openDrawer ? 'opacity-5' : ''
          } ${guideStatus ? '' : 'overflow-hidden'} ${paddingTop}`}
        setOpenResource={setOpenResource}
        openResource={openResource}
      />
      <div className="min-h-screen w-full">
        <div
          className={`${paddingTop} h-full bg-gray-4`}
        >
          <div className="sapp-loading ml-0 ml-20 h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
