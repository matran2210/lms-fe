import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { trackGAEvent } from '@utils/google-analytics'
import { onLinkSocial } from '@utils/index'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const PopupExtend = ({ open, setOpen }: IProps) => {
  return (
    <SappModalV2
      open={open}
      okButtonCaption="Back"
      onOk={() => {
        setOpen(false)
        trackGAEvent('Click Button Back Modal Expired Test')
      }}
      handleCancel={() => setOpen(false)}
      showCancelButton={false}
      showHeader={false}
      refClass="p-6 md:p-8 3xl:py-[70px] 3xl:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      title={undefined}
      cancelButtonCaption="Cancel"
    >
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertIcon />
      </div>
      <div className="text-center text-2xl font-semibold text-bw-1 md:text-4xl">
        Test Expired
      </div>
      <div className="mb-1 mt-4 px-1 text-center text-medium-sm xl:mb-7">
        <span className="text-gray-1">
          You can only take the entrance test twice. For further support, please
          contact SAPP Academy via
        </span>{' '}
        <span
          className="cursor-pointer text-primary underline"
          onClick={() => {
            onLinkSocial('https://www.facebook.com/sapp.edu.vn')
            trackGAEvent('Click Text Link Facebook')
          }}
        >
          Facebook.
        </span>
      </div>
    </SappModalV2>
  )
}

export default PopupExtend
