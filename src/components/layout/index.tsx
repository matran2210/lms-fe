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

interface LayoutProps {
  children: ReactNode
  title: string
  size?: 'sm' | 'md' | 'xl'
  showSidebar?: boolean
  fullWidth?: boolean
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const {
    children,
    title,
    size = 'xl',
    showSidebar = true,
    fullWidth = false,
  } = props
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
  } else if (showPinnedTrial) {
    paddingTop = 'pt-[54px]'
  }

  const guideStep = useAppSelector((state) => state.userGuideReducer?.step)

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-nowrap rounded-xl">
        {showSidebar === true && (
          <Sidebar
            isOpened={isOpened}
            toggleDrawer={toggleDrawer}
            className={clsx(
              'menu-sidebar-left',
              'hover:menu-sidebar-left--hover', // This still won't work as explained earlier
              'fixed hidden h-[calc(100vh-16px)] w-20 rounded-xl bg-white shadow-sidebar lg:block',
              {
                'overflow-hidden': !guideStatus,
                'menu-sidebar-left--hover':
                  guideStatus && (guideStep === 2 || guideStep === 3),
              },
              paddingTop,
            )}
            setOpenResource={setOpenResource}
            openResource={openResource}
          />
        )}
        <div
          className={clsx(`container min-h-screen`, {
            'max-w-[1179px]': size === 'sm',
            'max-w-[1444px]': size === 'md',
            'max-w-[1524px]': size === 'xl',
            'max-w-full p-0': fullWidth,
          })}
        >
          <div className={`${paddingTop} h-full bg-[#F9F9F9]`}>
            <div className={clsx('ml-0 h-full', { 'lg:ml-20': showSidebar })}>
              {children}
            </div>
          </div>
        </div>
      </div>
      <ModalMobile />
    </>
  )
}
