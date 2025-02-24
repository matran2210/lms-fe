import { CloseIconNote } from '@assets/icons'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { PageLink } from 'src/constants'
import SappModalV3 from '@components/base/modal/SappModalV3'
import toast from 'react-hot-toast'
import { useCourseContext } from '@contexts/index'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'

function CtaTrial() {
  const router = useRouter()

  const isEnablePinnedPages = [
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  const [showForm, setShowForm] = useState(false)
  const { setShowPinnedTrial, showPinnedTrial } = useCourseContext()

  const { openPinned, pinnedNotifications } = usePinnedNotifyContext()
  const isEnablePinnedNotiPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  useLayoutEffect(() => {
    if (
      localStorage.getItem('showPinTrial') === 'true' &&
      isEnablePinnedPages
    ) {
      setShowPinnedTrial(true)
    } else {
      setShowPinnedTrial(false)
    }
  }, [router])

  useEffect(() => {
    if (!showForm) return

    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if ((window as any).hbspt) {
        ;(window as any).hbspt.forms.create({
          portalId: process.env.NEXT_PUBLIC_PORTAL_ID,
          formId: process.env.NEXT_PUBLIC_FORM_ID,
          target: '#hubspotForm',
          region: 'na1',
          onFormSubmit: () => {
            toast.success('Thank you. Your Submission has been sent.')
            setShowForm(false)
          },
        })
      }
    })

    return () => {
      document.body.removeChild(script)
    }
  }, [showForm])

  return (
    <>
      {isEnablePinnedPages && showPinnedTrial && (
        <div
          className={`fixed z-50 h-[64px] w-full bg-primary text-white ${isEnablePinnedNotiPages && openPinned && pinnedNotifications?.data?.content ? 'top-12' : ''}`}
        >
          <Row className="flex h-[64px] w-[225px] flex-row content-center items-center justify-center lg:w-full">
            <Col span={1}></Col>
            <Col
              span={22}
              className="flex items-center justify-center font-sans"
            >
              <span className="text-lg font-semibold">Upgrade Now!&nbsp;</span>
              <span className="text-base">
                You have{' '}
                <span className="text-base font-semibold">
                  {localStorage.getItem('daysDifference')}
                </span>{' '}
                days left on your free trial.{' '}
                <span className="text-lg font-semibold">Upgrade</span> today to
                unlock the full course.
              </span>{' '}
              <button
                className="ms-8 h-[32px] bg-white px-4 text-sm font-medium text-primary"
                onClick={() => setShowForm(true)}
              >
                Update Now
              </button>
            </Col>
            <Col span={1}>
              <div
                onClick={() =>
                  setShowPinnedTrial(
                    localStorage.setItem('showPinTrial', 'false') as any,
                  )
                }
                className="float-right flex h-full cursor-pointer content-center items-center pr-6"
              >
                <CloseIconNote />
              </div>
            </Col>
          </Row>
        </div>
      )}
      <SappModalV3
        title={undefined}
        open={showForm}
        handleCancel={() => setShowForm(false)}
        onOk={() => {}}
        showFooter={false}
        icon={undefined}
        header={''}
        width={''}
        classNameModal="sapp-trial"
      >
        <div className="text-4xl font-semibold text-bw-1">
          Bạn cần tư vấn khóa học
        </div>
        <div className="mt-2 text-sm text-gray-1">
          Với thông tin bạn cung cấp, SAPP sẽ liên hệ với bạn để tư vấn khóa
          học.
        </div>
        {showForm && <div id="hubspotForm" className="hubspotForm mt-8"></div>}
      </SappModalV3>
    </>
  )
}

export default CtaTrial
