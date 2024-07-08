import { CloseIconNote, IconLoudSpeaker } from "@assets/icons";
import { usePinnedNotifyContext } from "@contexts/PinnedNotifyContext";
import { Col, Row } from "antd";
import React from "react";

function PinnedNotifications() {
  const {
    openPinned,
    setOpenPinned,
    pinnedNotifications,
  } = usePinnedNotifyContext()

  const handleClosePinned = () => {
    localStorage.setItem('openPinned', 'false')
    setOpenPinned(false)
  }

  return (
    <React.Fragment>
      {openPinned && pinnedNotifications?.data?.content && (
        <React.Fragment>
          <div className="w-full py-4 bg-pinned-1 z-50 fixed h-12 text-white">
            <Row className="flex flex-row">
              <Col span={2}></Col>
              <Col span={21}>
                <div className="flex flex-row justify-items-center">
                  <div className="mx-auto flex flex-row">
                    <div className='pr-1'><IconLoudSpeaker /></div>
                    <div className='flex flex-row w-full'>
                      <div className={`${pinnedNotifications?.data?.content?.length > 200 ? 'pinned-noti-marquee-parent shadow-pinned overflow-hidden h-12 whitespace-nowrap': ''} ml-5`}>
                        <p className={`${pinnedNotifications?.data?.content?.length > 200 ? 'pinned-noti-marquee-content leading-5' : ''}`}>{pinnedNotifications?.data?.content}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={1}>
                <div onClick={handleClosePinned} className="float-right pr-6"><CloseIconNote/></div>
              </Col>
            </Row>
          </div>
          <div className="pt-12"></div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PinnedNotifications;