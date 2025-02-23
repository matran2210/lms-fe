import { CloseIconNote, IconLoudSpeaker } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { PageLink } from 'src/constants'
import Marquee from 'react-fast-marquee'
import clsx from 'clsx'
import SappModalV3 from '@components/base/modal/SappModalV3'

function CtaTrial() {
  const router = useRouter()
  const { openPinned, setOpenPinned, pinnedNotifications } =
    usePinnedNotifyContext()

  const handleClosePinned = () => {
    localStorage.setItem('openPinned', 'false')
    setOpenPinned(false)
  }

  const showPinNoti = pinnedNotifications?.data?.content?.length < 200

  const isEnablePinnedPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!showForm) return

    const script = document.createElement('script')
    script.src = 'https://js.hsforms.net/forms/v2.js'
    document.body.appendChild(script)

    script.addEventListener('load', () => {
      if ((window as any).hbspt) {
        ;(window as any).hbspt.forms.create({
          portalId: '1774127',
          formId: 'c7ebbaff-bff3-420b-9f14-c55418c0843d',
          target: '#hubspotForm',
          region: 'na1',
          onFormSubmit: () => setShowForm(false),
        })
      }
    })

    return () => {
      document.body.removeChild(script)
    }
  }, [showForm])

  return (
    <>
      <div className={`fixed top-12 z-50 h-12 w-full bg-primary text-white`}>
        <div className="flex h-12 w-[225px] flex-row content-center items-center justify-center lg:w-full">
          <span>Upgrade Now!</span>
          <span>
            {' '}
            You have 21 days left on your free trial. Upgrade today to unlock
            the full course.
          </span>{' '}
          <button onClick={() => setShowForm(true)}>Update Now</button>
        </div>
      </div>
      <SappModalV3
        title={undefined}
        open={showForm}
        handleCancel={() => {}}
        onOk={() => {}}
        showFooter={false}
        icon={undefined}
        header={''}
        width={''}
      >
        <div className="text-4xl font-semibold text-bw-1">
          Bạn cần tư vấn khóa học
        </div>
        <div className="mt-2 text-sm text-gray-1">
          Với thông tin bạn cung cấp, SAPP sẽ liên hệ với bạn để tư vấn khóa
          học.
        </div>
        {showForm && <div id="hubspotForm" className="hubspotForm mt-4"></div>}
      </SappModalV3>
    </>
  )
}

export default CtaTrial
