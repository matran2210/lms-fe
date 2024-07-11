import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
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
      onOk={() => setOpen(false)}
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
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto mb-6">
        <AlertIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold text-center">
        Expired Test
      </div>
      <div className="text-medium-sm text-center mt-4 mb-1 xl:mb-7 px-1">
        <span className="text-gray-1">
          You can only take the entrance test once. For further support, please
          contact SAPP Academy via
        </span>{' '}
        <span
          className="text-primary underline cursor-pointer"
          onClick={() => onLinkSocial('https://www.facebook.com/sapp.edu.vn')}
        >
          Facebook.
        </span>
      </div>
    </SappModalV2>
  )
}

export default PopupExtend
