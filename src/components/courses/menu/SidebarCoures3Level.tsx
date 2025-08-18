import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { useCourseContext } from '@contexts/index'
import { useRouter } from 'next/router'
import { memo, useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import Sidebar3Level from './MenuSideBar'
import { Courses3LevelMenuProps } from 'src/type/courses-3-level'
import SidebarMobile from './MenuSideBarMobile'

const Courses3LevelMenu = ({ openDrawer }: Courses3LevelMenuProps) => {
  const router = useRouter()
  const [isOpened, setOpened] = useState<boolean>(false)
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
  } else if (showPinnedTrial) {
    paddingTop = 'pt-[54px]'
  }
  return (
    <>
      <SidebarMobile
        setOpenResource={setOpenResource}
        openResource={openResource}
      />
      <Sidebar3Level
        isOpened={isOpened}
        toggleDrawer={toggleDrawer}
        className={`menu-sidebar-left max-w-screen fixed top-4 m-4 mt-0 hidden h-[calc(100vh-32px)] w-20 min-w-[80px] rounded-xl bg-white shadow-sidebar_menu lg:left-0 lg:block ${
          openDrawer ? 'opacity-5' : ''
        } ${guideStatus ? '' : 'overflow-hidden'} ${paddingTop}`}
        setOpenResource={setOpenResource}
        openResource={openResource}
      />
    </>
  )
}

export default memo(Courses3LevelMenu)
