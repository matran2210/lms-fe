import { ArrowRightV2Icon } from '@assets/icons'
import PinnedNotificationsV2 from '@components/layout/PinnedNotifications/PinnedNotificationsV2'
import { useAppDispatch, useAppSelector } from 'src/redux/hook'
import { hidePopup } from 'src/redux/slice/Popup/Result-test'

interface IProps {}

const PopupCert = ({}: IProps) => {
  const dispatch = useAppDispatch()
  const selector = useAppSelector((state) => state.popupReducer)

  const onClickBackCourse = () => {
    dispatch({ type: hidePopup })
  }

  return (
    <>
      {selector.is_open && (
        <PinnedNotificationsV2
          bgColor="bg-primary-200"
          borderColor="border-primary"
        >
          <div className="flex items-center gap-4">
            <div></div>
            <div className="flex flex-col">
              <div className="text-xl font-semibold text-gray-800">
                Congratulations on getting your certificate!
              </div>
              <div className="text-sm font-normal text-gray-800">
                You completed course Performance Management Revision on
                September 16, 2024
              </div>
            </div>
          </div>

          <div
            className="flex cursor-pointer items-center gap-2"
            onClick={onClickBackCourse}
          >
            <div className="text-base font-semibold text-gray-800 underline">
              See Certificate
            </div>
            <div>
              <ArrowRightV2Icon />
            </div>
          </div>
        </PinnedNotificationsV2>
      )}
    </>
  )
}

export default PopupCert
