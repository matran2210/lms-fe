import { MobileNotFriendlyIcon } from '@lms/assets'
import { Modal } from 'antd'
import { createPortal } from 'react-dom'
import ButtonPrimary from '../button/ButtonPrimary'

interface IProps {
  open: boolean
  onClose: () => void
}
const ModalNotMobileFriendly = ({ open, onClose }: IProps) => {
  return createPortal(
    <Modal
      footer={false}
      className="sapp-modal"
      width={'343px'}
      centered
      open={open}
      onCancel={onClose}
      closable={false}
    >
      <div className="flex flex-col items-center gap-6">
        <MobileNotFriendlyIcon />
        <div className="flex flex-col items-center gap-4 text-gray-800">
          <div className="text-center text-2xl font-semibold">
            Sorry, page is no mobile friendly
          </div>
          <p className="text-center text-base">
            LMS Pro&rsquo;s Testing can be difficult on a mobile device. You can
            use tablet or desktop device for better experience.
          </p>
        </div>
        <ButtonPrimary title={'Back'} className="" onClick={onClose} full />
      </div>
    </Modal>,
    document.body,
  )
}

export default ModalNotMobileFriendly
