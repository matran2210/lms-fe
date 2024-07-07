import { CloseIconNote, IconLoudSpeaker } from "@assets/icons";
import { usePinnedNotifyContext } from "@contexts/PinnedNotifyContext";

function PinnedNotifications() {
  const {
    openPinned,
    setOpenPinned,
    pinnedNotifications,
  } = usePinnedNotifyContext()

  return (
    <>
      {openPinned && pinnedNotifications?.data?.content && (
        <div>
          <div className='sapp-noti-header text-center w-full flex flex-row justify-between'>
          <div className='flex flex-row w-full'>
            <div className='pr-2 pt-3'><IconLoudSpeaker /></div>
            <div className="marqueeNotifParent">
              <p className="marqueeNotifContent">{pinnedNotifications?.data?.content}</p>
            </div>
          </div>
          <div onClick={() => setOpenPinned(false)} className="mr-3"><CloseIconNote/></div>
        </div>
        <div className="pt-12"></div>
        </div>
      )}
      </>
  )
}

export default PinnedNotifications;