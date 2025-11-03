import { CloseIconNote } from '@assets/icons'
import { useRouter } from 'next/router'
import React, { useLayoutEffect } from 'react'
import { PageLink } from 'src/constants'
import { useCourseContext } from '@contexts/index'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import PinnedNotificationsV2 from 'src/components/layout/PinnedNotifications/PinnedNotificationsV2'

const ENABLED_PINNED_PAGES = [
  PageLink.COURSE_DETAIL,
  PageLink.COURSE_PART_DETAIL,
  PageLink.COURSE_ACTIVITY,
  PageLink.TEACHER_COURSE_DETAIL_ID,
  PageLink.TEACHER_COURSE_PART_DETAIL,
  PageLink.TEACHER_COURSE_ACTIVITY,
]

const ENABLED_PINNED_NOTI_PAGES = [
  PageLink.COURSES,
  PageLink.TEACHERS,
  PageLink.USERPAGE,
  ...ENABLED_PINNED_PAGES,
]

function CtaTrial() {
  const router = useRouter()
  const { setShowPinnedTrial, showPinnedTrial, setOpenPopupCTA } =
    useCourseContext()
  const { openPinned } = usePinnedNotifyContext()

  const isEnablePinnedPages = ENABLED_PINNED_PAGES.includes(router.pathname)
  const isEnablePinnedNotiPages = ENABLED_PINNED_NOTI_PAGES.includes(
    router.pathname,
  )

  useLayoutEffect(() => {
    setShowPinnedTrial(
      localStorage.getItem('showPinTrial') === 'true' && isEnablePinnedPages,
    )
  }, [router, isEnablePinnedPages, setShowPinnedTrial])

  const handleClose = () => {
    localStorage.setItem('showPinTrial', 'false')
    setShowPinnedTrial(false)
  }

  const handleUpgrade = () => {
    setOpenPopupCTA({
      lockSection: false,
      ctaUpgrade: true,
      thankYou: false,
      thankYouLater: false,
    })
  }

  if (!isEnablePinnedPages || !showPinnedTrial) return null

  return (
    <>
      {isEnablePinnedNotiPages && openPinned && (
        <PinnedNotificationsV2
          bgColor="bg-info-100"
          borderColor="border-info"
          classPinned="items-start justify-between lg:items-center"
        >
          <div className="hidden lg:block" />
          <div className="flex w-[90%] flex-col gap-2 text-sm leading-normal text-gray-800 md:text-base lg:flex-row lg:justify-center">
            <div>
              You have&nbsp;
              <span className="font-semibold">
                {localStorage.getItem('daysDifference')}&nbsp;days&nbsp;
              </span>
              left on your free trial. Upgrade today to unlock the full course.
            </div>
            <div
              className="cursor-pointer font-semibold underline hover:text-primary"
              onClick={handleUpgrade}
            >
              Upgrade Now
            </div>
          </div>
          <div className="cursor-pointer" onClick={handleClose}>
            <CloseIconNote />
          </div>
        </PinnedNotificationsV2>
      )}
    </>
  )
}

export default CtaTrial
