import { CloseIconNote, CursorIcon } from '@assets/icons'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { useLayoutEffect } from 'react'
import { PageLink } from 'src/constants'
import { useCourseContext } from '@contexts/index'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import PopupLockContent from '@components/mycourses/hubspot/PopupLockContent'

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
      <div
        className={`fixed z-50 h-[54px] w-full bg-primary text-white ${
          isEnablePinnedNotiPages &&
          openPinned &&
          pinnedNotifications?.data?.content
            ? 'top-12'
            : ''
        }`}
      >
        <Row className="flex h-[54px] w-[225px] flex-row content-center items-center justify-center lg:w-full">
          <Col span={1} />
          <Col
            span={22}
            className="flex h-full items-center justify-center font-sans"
          >
            <span className="text-base">
              You have{' '}
              <span className="text-base font-semibold">
                {localStorage.getItem('daysDifference')}
              </span>{' '}
              days left on your free trial.{' '}
              <span className="text-lg font-semibold">Upgrade</span> today to
              unlock the full course.
            </span>
            <button
              className="ms-8 h-[32px] bg-white px-4 text-[14px] font-medium leading-[17px] text-primary"
              onClick={handleUpgrade}
            >
              Upgrade Now
            </button>
            <div className="ms-1.5 mt-5 flex h-full items-center">
              <CursorIcon />
            </div>
          </Col>
          <Col span={1}>
            <div
              onClick={handleClose}
              className="float-right flex h-full cursor-pointer content-center items-center pr-6"
            >
              <CloseIconNote />
            </div>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default CtaTrial
