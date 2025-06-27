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
  size?: 'sm' | 'md' | 'xl'
  showSidebar?: boolean
  fullWidth?: boolean
  handleToggleSidebar?: () => void
  className?: string
}

// eslint-disable-next-line import/no-unused-modules
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
          'lg:ml-20': showSidebar,
        })}
      >
        <Sidebar
          isOpened={isOpenSidebar}
          toggleDrawer={toggleDrawer}
          className={clsx(
            'menu-sidebar-left transition-all duration-150 ease-in-out',
            'hover:menu-sidebar-left--hover', // This still won't work as explained earlier
            `fixed left-0 h-[calc(100vh-32px)] max-h-[1080px] w-0 rounded-xl bg-white shadow-sidebar lg:block lg:w-20`,
            {
              'overflow-hidden': !guideStatus,
              'menu-sidebar-left--hover':
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
            'max-w-[calc(1444px+4rem)]': size === 'md',
            'max-w-[calc(1524px+4rem)]': size === 'xl',
            'max-w-full p-0': fullWidth,
          })}
        >
          <div className={clsx(`${paddingTop} h-full bg-[#F9F9F9]`, className)}>
            <div className={clsx('ml-0 h-full')}>{children}</div>
          </div>
        </div>
      </div>
      <ModalMobile />
    </>
  )
}
