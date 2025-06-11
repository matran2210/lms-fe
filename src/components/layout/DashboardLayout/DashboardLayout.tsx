import { useCourseContext } from '@contexts/index'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import Sidebar from '../Sidebar'
import clsx from 'clsx'

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

  let paddingTop = ''

  if (isEnablePinnedPages && openPinned && pinnedNotifications?.data?.content) {
    paddingTop = showPinnedTrial ? 'pt-[102px]' : 'pt-12'
  } else if (!pinnedNotifications?.data?.content) {
    paddingTop = 'pt-[54px]'
  }

  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  return (
    <div className="flex flex-nowrap rounded-xl">
      <Sidebar
        isOpened={isOpened}
        toggleDrawer={toggleDrawer}
        className={clsx(
          'menu-sidebar-left',
          'fixed top-0 w-20 rounded-xl bg-white shadow-sidebar',
          'md:left-0',
          'hover:menu-sidebar-left--hover', // This still won't work as explained earlier
          {
            'opacity-5': openDrawer,
            'overflow-hidden': !guideStatus,
            'menu-sidebar-left--hover':
              guideStatus && (guideStep === 2 || guideStep === 3),
          },
          paddingTop,
        )}
        setOpenResource={setOpenResource}
        openResource={openResource}
      />
      <div className="min-h-screen w-full">
        <div className={`${paddingTop} h-full bg-[#F9F9F9]`}>
          <div className="sapp-loading h-full">{children}</div>
        </div>
      </div>
    </div>
  )
}
