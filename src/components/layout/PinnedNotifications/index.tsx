import { CloseIconNote, IconLoudSpeaker } from "@assets/icons";
import EditorReader from "@components/base/editor/EditorReader";
import { usePinnedNotifyContext } from "@contexts/PinnedNotifyContext";
import { Col, Row } from "antd";
import React from "react";

function PinnedNotifications() {
  const { openPinned, setOpenPinned, pinnedNotifications } =
    usePinnedNotifyContext()

  const handleClosePinned = () => {
    localStorage.setItem('openPinned', 'false')
    setOpenPinned(false)
  }

  const showPinNoti = pinnedNotifications?.data?.content?.length > 200

  return (
    <React.Fragment>
      {openPinned && pinnedNotifications?.data?.content && (
        <React.Fragment>
          <div className={`pinned-container w-full bg-pinned-1 z-50 fixed h-12 text-white`}>
            <Row className="flex flex-row">
              <Col span={2}></Col>
              <Col span={21}>
                <div className="flex flex-row justify-items-center">
                  <div className="mx-auto flex flex-row">
                    <div className='py-4'><IconLoudSpeaker /></div>
                    <div className='flex flex-row'>
                      <div className={`${showPinNoti ? 'pinned-noti-marquee-parent shadow-pinned overflow-hidden h-12' : ''} ml-5`}>
                        <p className={`${showPinNoti ? 'pinned-noti-marquee-content leading-5' : ''}`}>
                          <EditorReader text_editor_content={pinnedNotifications?.data?.content} />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={1}>
                <div onClick={handleClosePinned} className="float-right pr-6 cursor-pointer py-4"><CloseIconNote /></div>
              </Col>
            </Row>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default PinnedNotifications
