import { CloseIconNote, IconLoudSpeaker } from '@assets/icons'
import EditorReader from '@components/base/editor/EditorReader'
import { usePinnedNotifyContext } from '@contexts/PinnedNotifyContext'
import { Col, Row } from 'antd'
import { useRouter } from 'next/router'						   
import React from 'react'
import { PageLink } from 'src/constants'							

function PinnedNotifications() {
  const router = useRouter()
  const { openPinned, setOpenPinned, pinnedNotifications } =
    usePinnedNotifyContext()

  const handleClosePinned = () => {
    localStorage.setItem('openPinned', 'false')
    setOpenPinned(false)
  }

  const showPinNoti = pinnedNotifications?.data?.content?.length > 200

	const isEnablePinnedPages = [
    PageLink.COURSES,
    PageLink.USERPAGE,
    PageLink.COURSE_DETAIL,
    PageLink.COURSE_PART_DETAIL,
    PageLink.COURSE_ACTIVITY
  ].includes(router.pathname)
  
  return (
    <React.Fragment>
      {isEnablePinnedPages && openPinned && pinnedNotifications?.data?.content && (
        <React.Fragment>
          <div className={`w-full bg-pinned-1 z-50 fixed h-12 text-white`}>
            <Row className="flex flex-row h-12">
              <Col span={2}></Col>
              <Col span={21}>
                <div className="flex flex-row justify-items-center h-12">
                  <div className="mx-auto flex flex-row">
                    <div className="text-center content-center">
                      <IconLoudSpeaker />
                    </div>
                    <div className="flex flex-row items-center content-center">
                      <div
                        className={`${showPinNoti ? 'shadow-pinned overflow-hidden' : ''} ml-2`}
                      >
                        <p
                          className={`${showPinNoti ? 'pinned-noti-marquee-content leading-5' : ''}`}
                        >
                          <EditorReader
                            text_editor_content={
                              pinnedNotifications?.data?.content
                            }
                            pinned
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={1}>
                <div
                  onClick={handleClosePinned}
                  className="float-right pr-6 cursor-pointer h-full content-center"
                >
                  <CloseIconNote />
                </div>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PinnedNotifications
