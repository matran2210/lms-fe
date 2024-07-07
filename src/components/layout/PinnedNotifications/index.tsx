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
          <div className='flex flex-row'>
            <div className='pr-2'><IconLoudSpeaker /></div>
            <div>{pinnedNotifications?.data?.content}</div>
          </div>
          <div onClick={() => setOpenPinned(false)}><CloseIconNote/></div>
        </div>
        <div className="pt-12"></div>
        </div>
      )}
      </>
  )
}

export default PinnedNotifications;