import { SadIcon } from '@lms/assets'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import ButtonPrimary from '../button/ButtonPrimary'
import { isMobileExtensive } from '@lms/utils'

const ModalMobile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const accessToken = localStorage.getItem('actToken')

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }
  useEffect(() => {
    if (isMobileExtensive()) {
      const hasSeenModal = localStorage.getItem('hasSeenMobileWarning')

      if (hasSeenModal !== 'true') {
        localStorage.setItem('hasSeenMobileWarning', 'true')
        showModal()
      } else if (accessToken !== localStorage.getItem('lastSeenToken')) {
        accessToken && localStorage.setItem('lastSeenToken', accessToken)
        showModal()
      }
    }
  }, [accessToken])

  return createPortal(
    <Modal
      footer={false}
      className="p-0"
      width={'398px'}
      centered
      styles={{
        content: {
          padding: 0,
        },
      }}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="grid place-items-center px-6 py-20">
        <SadIcon />
        <p className="mt-10 text-center text-[32px] font-semibold leading-10">
          Sorry, page is not mobile friendly
        </p>
        <p className="my-4 text-center text-[#A1A1A1]">
          LMS Pro can be difficult to use on a mobile device. We are going to
          improve our website very soon.
        </p>
        <ButtonPrimary
          title={'Continue'}
          className="mt-10 h-10 w-[200px]"
          onClick={handleCancel}
        />
      </div>
    </Modal>,
    document.body,
  )
}

export default ModalMobile
