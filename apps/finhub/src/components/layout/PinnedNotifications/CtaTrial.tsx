import { CloseIconNote } from '@lms/assets'
import { useRouter } from 'next/router'
import React, { useLayoutEffect } from 'react'
import PinnedNotificationsV2 from './PinnedNotificationsV2'
import { PageLink } from 'src/constants/routes'
import { useCourseContext, usePinnedNotifyContext } from '@lms/contexts'

const ENABLED_PINNED_PAGES = [
  `${PageLink.SHORT_COURSE_DETAIL}/[courseId]`,
  `${PageLink.SHORT_COURSE_DETAIL}/[courseId]/activity/[id]`,
]

const ENABLED_PINNED_NOTI_PAGES = [
  PageLink.SHORT_COURSE,
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
        <div className="z-2 sticky inset-x-0 bottom-24 md:bottom-27 lg:bottom-4">
          <div className="flex w-full flex-col gap-4">
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
                  left on your free trial. Upgrade today to unlock the full
                  course.
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
          </div>
        </div>
      )}
    </>
  )
}

export default CtaTrial
