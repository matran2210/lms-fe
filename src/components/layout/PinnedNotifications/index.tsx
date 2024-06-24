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
          <div className='sapp-noti-header text-center w-full flex flex-row justify-between'>
          <div className='flex flex-row w-full'>
            <div className='pr-2 pt-2'><IconLoudSpeaker /></div>
            <div className={`${pinnedNotifications?.data?.content?.length > 200 ? 'marqueeNotifParent': 'pt-1 ml-5'}`}>
              <p className={`${pinnedNotifications?.data?.content?.length > 200 ? 'marqueeNotifContent' : ''}`}>{pinnedNotifications?.data?.content}</p>
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