import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { useCourseContext } from '@contexts/index'
import clsx from 'clsx'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { memo, ReactElement, ReactNode, useState } from 'react'
import { PageLink } from 'src/constants'
import { useAppSelector } from 'src/redux/hook'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { Courses3LevelMenu } from '@components/courses'
import { withMasterFinanceProvider } from '@contexts/MasterFinance'
interface LayoutProps {
  children: ReactNode
  title: string
  size?: 'sm' | 'md' | 'xl' | '2xl'
  showSidebar?: boolean
  fullWidth?: boolean
  handleToggleSidebar?: () => void
  className?: string
}

// eslint-disable-next-line import/no-unused-modules
const Layout = (props: LayoutProps) => {
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
        <Courses3LevelMenu />

        <div
          className={clsx('container min-h-screen', {
            'max-w-[calc(1179px+4rem)]': size === 'sm',
            'max-w-[calc(1444px+4rem)]': size === 'md',
            'max-w-[calc(1524px+4rem)]': size === 'xl',
            'max-w-[calc(1580px+4rem)]': size === '2xl',
            'max-w-full p-0': fullWidth,
          })}
        >
          <div className={clsx(`${paddingTop} h-full bg-[#F9F9F9]`, className)}>
            <div className={clsx('ml-0 h-full')}>{children}</div>
          </div>
        </div>
      </div>
      {/* <ModalMobile /> */}
    </>
  )
}

export default memo(withMasterFinanceProvider(Layout))
