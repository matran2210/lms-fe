import { CloseIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { onLinkSocial } from '@utils/index'
import React, { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}

const PopupNotCus = ({ open, setOpen }: IProps) => {
  return (
    <SappModalV2
      title={undefined}
      open={open}
      handleCancel={() => {}}
      onOk={() => {}}
      showFooter={false}
      classNameModal="sapp-custom--modal"
    >
      <div
        className="flex cursor-pointer justify-end text-white"
        onClick={() => setOpen(false)}
      >
        <CloseIcon className="stroke-white" />
      </div>
      <div className="flex h-[calc(100vh-3.125rem)] items-center justify-center text-base font-normal text-white">
        <span className="text-center">
          <span className="text-white">
            Bạn tạm thời chưa thể xem kết quả chi tiết. Mọi thắc mắc vui lòng
            liên hệ tới Hotline
          </span>
          <span className="mx-1 text-primary">19002225</span>
          hoặc
          <span
            className="mx-1 cursor-pointer text-primary hover:underline"
            onClick={() =>
              onLinkSocial('https://www.facebook.com/ServiceofSAPP')
            }
          >
            Fanpage
          </span>
          để được hỗ trợ nhanh chóng nhất.
        </span>
      </div>
    </SappModalV2>
  )
}

export default PopupNotCus
