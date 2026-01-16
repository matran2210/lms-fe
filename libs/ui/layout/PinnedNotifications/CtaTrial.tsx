'use client'

import { CloseIconNote } from '@lms/assets'
import {
  useCourseContext,
  useFeature,
  usePinnedNotifyContext,
} from '@lms/contexts'
import { useLayoutEffect, useMemo } from 'react'
import PinnedNotificationWrapper from './PinnedNotificationWrapper'

type CourseRouteType = 'LIST' | 'DETAIL' | 'SECTION' | 'ACTIVITY' | 'OTHER'

export default function CtaTrial() {
  const { pageLink, pathname } = useFeature()
  const { setShowPinnedTrial, setOpenPopupCTA } = useCourseContext()
  const { openPinned, setOpenPinned } = usePinnedNotifyContext()

  const ENABLED_PINNED_PAGES = useMemo(
    () => [
      pageLink.TEACHER_COURSE_DETAIL_ID,
      pageLink.TEACHER_COURSE_PART_DETAIL,
      pageLink.TEACHER_COURSE_ACTIVITY,
    ],
    [pageLink],
  )

  const ENABLED_PINNED_NOTI_PAGES = useMemo(
    () => [
      pageLink.COURSES,
      pageLink.TEACHERS,
      pageLink.USERPAGE,
      ...ENABLED_PINNED_PAGES,
    ],
    [pageLink, ENABLED_PINNED_PAGES],
  )

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

  const isEnablePinnedNotiPages =
    ENABLED_PINNED_NOTI_PAGES.includes(pathname as string) || isCourseDetailLike

  useLayoutEffect(() => {
    const shouldShow =
      localStorage.getItem('showPinTrial') === 'true' &&
      isCourseDetailLike

    setShowPinnedTrial(shouldShow)
  }, [pathname, isCourseDetailLike, setShowPinnedTrial])

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
      {isEnablePinnedNotiPages && openPinned && (
        <PinnedNotificationWrapper
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
        </PinnedNotificationWrapper>
      )}
    </>
  )
}
