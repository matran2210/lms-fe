import ModalMobile from '@components/base/modal/ModalMobile'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { useCourseContext } from '@contexts/index'
import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, ReactNode, useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import Sidebar from './Sidebar'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
interface LayoutProps {
  children: ReactNode
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  showSidebar?: boolean
  fullWidth?: boolean
  handleToggleSidebar?: () => void
  className?: string
  childClassName?: string
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const {
    children,
    title,
    size = 'lg',
    showSidebar = true,
    fullWidth = false,
    handleToggleSidebar,
    className,
    childClassName,
  } = props
  const router = useRouter()
  const { isShowMenuContent } = useTailwindBreakpoint()

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
  const [openExaminationInfo, setOpenExaminationInfo] = useState(false)

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
  }

  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className={clsx('flex flex-nowrap rounded-xl', {
          'lg:ml-[calc(5rem+32px)]': showSidebar,
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
          openExaminationInfo={openExaminationInfo}
          setOpenExaminationInfo={setOpenExaminationInfo}
        />

        <div
          className={clsx('container min-h-screen', {
            'max-w-[calc(1179px+4rem)]': size === 'sm',
            'max-w-[calc(1230px+4rem)]': size === 'md',
            'max-w-[calc(1318px+4rem)]': size === 'lg',
            'max-w-[calc(1524px+4rem)]': size === 'xl',
            'max-w-[calc(1644px+4rem)]': size === '2xl',
            '!max-w-full p-0': fullWidth,
          })}
        >
          <div className={clsx(`${paddingTop} bg-[#F9F9F9]`, className)}>
            <div className={clsx('ml-0', childClassName)}>{children}</div>
          </div>
        </div>
      </div>
      {/* <ModalMobile /> */}
    </>
  )
}
