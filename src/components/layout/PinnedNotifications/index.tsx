import { CloseIconNote, IconLoudSpeaker } from "@assets/icons";
import { usePinnedNotifyContext } from "@contexts/PinnedNotifyContext";
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
          <div className='sapp-pinned-noti-header z-50 fixed flex h-12 text-center justify-center text-white w-full flex flex-row justify-between'>
          <div className='flex flex-row w-full'>
            <div className='pr-1 pt-1'><IconLoudSpeaker /></div>
            <div className={`${pinnedNotifications?.data?.content?.length > 200 ? 'pinned-noti-marquee-parent overflow-hidden h-12 whitespace-nowrap': ''} pt-1 ml-5`}>
              <p className={`${pinnedNotifications?.data?.content?.length > 200 ? 'pinned-noti-marquee-content leading-5' : ''}`}>{pinnedNotifications?.data?.content}</p>
            </div>
          </div>
          <div onClick={handleClosePinned} className="mr-3"><CloseIconNote/></div>
        </div>
        <div className="pt-12"></div>
        </React.Fragment>
      )}
      </React.Fragment>
  )
}

export default PinnedNotifications;