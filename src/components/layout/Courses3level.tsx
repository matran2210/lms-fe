import { memo, PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { useCourseContext } from '@contexts/index'
import { PageLink } from 'src/constants'
import { Courses3LevelMenu } from '@components/courses'
import { withMasterFinanceProvider } from '@contexts/MasterFinance'

type Courses3LevelProps = {
  children: React.ReactNode
  openDrawer?: boolean
}

const LayoutCourses3Level = ({ children, openDrawer }: Courses3LevelProps) => {
  const router = useRouter()

  const { openPinned, pinnedNotifications } = usePinnedNotifyContext()
  const { showPinnedTrial } = useCourseContext()

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
      <div className="flex flex-col flex-nowrap bg-gray-4 md:flex-row">
        <Courses3LevelMenu />
        <div className="ml-auto min-h-screen w-full bg-gray-4 lg:mr-[50px] lg:max-w-[calc(100%-280px)]">
          {children}
        </div>
      </div>
    </>
  )
}

export default memo(withMasterFinanceProvider(LayoutCourses3Level))
