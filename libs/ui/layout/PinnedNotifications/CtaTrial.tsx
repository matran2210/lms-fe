'use client'

import { CloseIconNote } from '@lms/assets'
import {
  useCourseContext,
  useFeature,
  usePinnedNotifyContext,
} from '@lms/contexts'
import { useLayoutEffect, useMemo } from 'react'
import PinnedNotificationsV2 from './PinnedNotificationsV2'

type CourseRouteType = 'LIST' | 'DETAIL' | 'SECTION' | 'ACTIVITY' | 'OTHER'

export default function CtaTrial() {
  const { pathname } = useFeature()
  const { setShowPinnedTrial, setOpenPopupCTA, showPinnedTrial } = useCourseContext()
  const { setOpenPinned } = usePinnedNotifyContext()

  const courseRouteType: CourseRouteType = useMemo(() => {
    if (/^\/courses\/my-course\/[^/]+$/.test(pathname as string)) return 'DETAIL'
    if (/^\/courses\/[^/]+\/section\/[^/]+$/.test(pathname as string)) return 'SECTION'
    if (/^\/courses\/[^/]+\/activity\/[^/]+$/.test(pathname as string)) return 'ACTIVITY'
    if ((pathname as string).startsWith('/courses')) return 'LIST'
    return 'OTHER'
  }, [pathname])

  const isCourseDetailLike =
    courseRouteType === 'DETAIL' ||
    courseRouteType === 'SECTION' ||
    courseRouteType === 'ACTIVITY'

  const shouldShow =
    localStorage.getItem('showPinTrial') === 'true'

  useLayoutEffect(() => {

    setShowPinnedTrial(shouldShow || false)
  }, [pathname, shouldShow])

  const handleClose = () => {
    localStorage.setItem('showPinTrial', 'false')
    setShowPinnedTrial(false)
    setOpenPinned(false)
  }

  const handleUpgrade = () => {
    setOpenPopupCTA({
      lockSection: false,
      ctaUpgrade: true,
      thankYou: false,
      thankYouLater: false,
    })
  }
  
  return (
    <>
      {isCourseDetailLike && showPinnedTrial && (
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
