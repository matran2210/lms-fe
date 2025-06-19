import { CloseIconNote } from '@assets/icons'
import { useRouter } from 'next/router'
import React, { useLayoutEffect } from 'react'
import { PageLink } from 'src/constants'
import { useCourseContext } from '@contexts/index'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import PopupLockContent from '@components/mycourses/hubspot/PopupLockContent'
import PinnedNotificationsV2 from 'src/components/layout/PinnedNotifications/PinnedNotificationsV2'

const ENABLED_PINNED_PAGES = [
  PageLink.COURSE_DETAIL,
  PageLink.COURSE_PART_DETAIL,
  PageLink.COURSE_ACTIVITY,
]

const ENABLED_PINNED_NOTI_PAGES = [
  PageLink.COURSES,
  PageLink.USERPAGE,
  ...ENABLED_PINNED_PAGES,
]

function CtaTrial() {
  const router = useRouter()
  const { setShowPinnedTrial, showPinnedTrial, openPopupCTA, setOpenPopupCTA } =
    useCourseContext()
  const { openPinned, pinnedNotifications } = usePinnedNotifyContext()

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
      <PopupLockContent showForm={openPopupCTA} setShowForm={setOpenPopupCTA} />
      {openPopupCTA && (
        <PinnedNotificationsV2
          bgColor="bg-info-100"
          borderColor="border-info"
          classPinned="md:items-start lg:items-center"
          heightPinned="h-24"
        >
          <div className="md:hidden lg:block" />
          <div className="h- flex gap-2 leading-normal text-gray-800 md:flex-col md:text-base lg:flex-row lg:text-lg">
            <div>
              You have&nbsp;
              <span className="font-semibold">
                {localStorage.getItem('daysDifference')}&nbsp;days left&nbsp;
              </span>
              on your free trial. Upgrade today to unlock the full course.
            </div>
            <div
              className="cursor-pointer font-semibold underline"
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
