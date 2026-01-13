'use client'
import { useAppSelector } from 'src/redux/hook'
import { useCourseContext, usePinnedNotifyContext } from '@lms/contexts'
import { useTailwindBreakpoint } from '@lms/hooks'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { ReactElement, ReactNode, useEffect, useState } from 'react'
import { PageLink } from 'src/constants/routes'
import Sidebar from './Sidebar'

interface LayoutProps {
  readonly children: ReactNode
  readonly title: string
  readonly size?: 'sm' | 'md' | 'xl' | '2xl'
  readonly showSidebar?: boolean
  readonly fullWidth?: boolean
  readonly handleToggleSidebar?: () => void
  readonly className?: string
}

export default function Layout(props: LayoutProps): ReactElement {
  const {
    children,
    title,
    size = 'xl',
    showSidebar = true,
    fullWidth = false,
    handleToggleSidebar,
    className,
  } = props
  const { isShowMenuContent } = useTailwindBreakpoint()
  const pathName = usePathname()

  const { isOpenSidebar, setOpenSidebar } = useCourseContext()
  const toggleDrawer = () => {
    handleToggleSidebar?.()
    setOpenSidebar(!isOpenSidebar)
  }

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
  ].includes(pathName)

  let paddingTop = ''

  if (isEnablePinnedPages && openPinned && pinnedNotifications?.data?.content) {
    paddingTop = showPinnedTrial ? 'pt-[102px]' : 'pt-12'
  }

  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div
      className={clsx('container min-h-screen', {
        'max-w-[calc(1179px+4rem)]': size === 'sm',
        'max-w-[calc(1280px+4rem)]': size === 'md',
        'max-w-[calc(1318px+4rem)]': size === 'xl',
        'max-w-[calc(1580px+4rem)]': size === '2xl',
        '!max-w-full p-0': fullWidth,
      })}
    >
      <Sidebar
        isOpened={isOpenSidebar}
        toggleDrawer={toggleDrawer}
        className={clsx(
          'menu-sidebar-left transition-all duration-300 ease-out',
          'hover:menu-sidebar-left--hover', // This still won't work as explained earlier
          `fixed left-0 h-[calc(100vh-32px)] rounded-xl bg-white shadow-[0_0_16px_0_rgba(0,0,0,0.08)] lg:block lg:w-20`,
          {
            // 'overflow-hidden': !guideStatus,
            'menu-sidebar-left--hover !w-[220px]':
              (guideStatus && (guideStep === 2 || guideStep === 3)) ||
              isShowMenuContent,
            'h-[calc(100vh-32px-60px)]': !openPinned,
            // 'hidden': !showSidebar,
            // 'w-[220px]': isOpenSidebar,
            'w-[220px] translate-x-0': showSidebar,
            'w-[220px] -translate-x-60': !showSidebar,
          },
          paddingTop,
        )}
        setOpenResource={setOpenResource}
        openResource={openResource}
      />

      <div
        className={clsx('container min-h-screen', {
          'max-w-[calc(1179px+4rem)]': size === 'sm',
          'max-w-[calc(1280px+4rem)]': size === 'md',
          'max-w-[calc(1318px+4rem)]': size === 'xl',
          'max-w-[calc(1580px+4rem)]': size === '2xl',
          '!max-w-full p-0': fullWidth,
        })}
      >
        <div className={clsx(`${paddingTop} h-full bg-[#F9F9F9]`, className)}>
          <div className={clsx('ml-0 h-full')}>{children}</div>
        </div>
      </div>
    </div>
  )
}
