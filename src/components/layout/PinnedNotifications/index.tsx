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
    PageLink.COURSE_ACTIVITY,
  ].includes(router.pathname)

  return (
    <React.Fragment>
      {isEnablePinnedPages &&
        openPinned &&
        pinnedNotifications?.data?.content && (
          <React.Fragment>
            <div className={`fixed z-50 h-12 w-full bg-support-1 text-white`}>
              <Row className="flex h-12 flex-row">
                <Col span={2}></Col>
                <Col span={21}>
                  <div className="flex h-12 flex-row justify-items-center">
                    <div className="mx-auto flex flex-row">
                      <div className="flex content-center items-center text-center">
                        <IconLoudSpeaker />
                      </div>
                      <div className="flex w-[225px] flex-row content-center items-center sm:w-[610px] 3xl:w-[1250px]">
                        <div
                          className={`${showPinNoti ? 'overflow-hidden text-clip whitespace-nowrap shadow-pinned' : ''} ml-2`}
                        >
                          <p
                            className={`${showPinNoti ? 'pinned-noti-marquee-content leading-5' : ''}`}
                          >
                            <EditorReader
                              text_editor_content={
                                pinnedNotifications?.data?.content
                              }
                              pinned
                              className="w-max overflow-hidden text-clip whitespace-nowrap"
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
                    className="float-right flex h-full cursor-pointer content-center items-center pr-6"
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
