import { LockSectionIcon, ThankYouIcon, UnlockIcon } from '@lms/assets'
import { useFeature } from '@lms/contexts'
import { SappModalV3 } from '@lms/ui'
import React, { Dispatch, SetStateAction } from 'react'

export interface IPopupFormState {
  lockSection: boolean
  ctaUpgrade: boolean
  thankYou: boolean
  thankYouLater: boolean
}

interface PopupLockContentProps {
  showForm: IPopupFormState
  setShowForm: Dispatch<SetStateAction<IPopupFormState>>
}

const MODAL_CONTENT = {
  lockSection: {
    header: 'This content is locked',
    content:
      'Sorry, you do not have access to this content. Click ‘Upgrade Now’ to receive a personalized learning consultation call from our admissions consultant .',
    icon: <LockSectionIcon />,
  },
  ctaUpgrade: {
    header: 'Unlock Your Learning Journey',
    content:
      "Click 'Upgrade Now' to receive a personalized learning consultation call from our admissions consultant .",
    icon: <UnlockIcon />,
  },
  thankYou: {
    header: 'Thank you!',
    content:
      "We'll contact you within 24 hours to unlock your full trial experience!",
    icon: <ThankYouIcon />,
  },
  thankYouLater: {
    header: 'Thank you!',
    content:
      "We've already received your request. Our team will be in touch within 24 hours.",
    icon: <ThankYouIcon />,
  },
}

const PopupLockContent: React.FC<PopupLockContentProps> = ({
  showForm,
  setShowForm,
}) => {
  const {courseApi, router, params}= useFeature()

  /**
   * Xử lý đóng modal bằng cách reset tất cả các trạng thái về false
   * Được gọi khi người dùng click nút đóng hoặc click bên ngoài modal
   */
  const handleClose = () => {
    setShowForm({
      lockSection: false,
      ctaUpgrade: false,
      thankYou: false,
      thankYouLater: false,
    })
  }

  /**
   * Lấy nội dung hiển thị cho modal dựa trên trạng thái hiện tại
   * Ưu tiên theo thứ tự: lockSection > ctaUpgrade > thankYouLater > thankYou
   * @returns {Object} Object chứa header, content và icon tương ứng với trạng thái
   */
  const getModalContent = () => {
    const activeKey = (Object.entries(showForm).find(
      ([_, value]) => value,
    )?.[0] || 'thankYou') as keyof typeof MODAL_CONTENT

    return MODAL_CONTENT[activeKey]
  }

  /**
   * Xử lý khi người dùng click nút "Upgrade Now"
   * Gọi API để nâng cấp tài khoản trial
   * Dựa vào kết quả API để hiển thị thông báo thank you phù hợp
   */

  const handleUpgrade = async () => {
    const res = await courseApi.upgradeNowTrial(
      params?.courseId || params?.id,
    ) as { data?: { upgrade_now_available: boolean } }

    const isAvailable = !!res?.data?.upgrade_now_available

    setShowForm({
      lockSection: false,
      ctaUpgrade: false,
      thankYou: isAvailable,
      thankYouLater: !isAvailable,
    })
  }

  const handleOk = () => {
    if (showForm.thankYou || showForm.thankYouLater) {
      handleClose()
    } else {
      handleUpgrade()
    }
  }

  const isOpen = Object.values(showForm).some(Boolean)
  const { header, content, icon } = getModalContent()

  const okButtonCaption =
    showForm.thankYou || showForm.thankYouLater
      ? 'Back to Study'
      : 'Upgrade Now'

  const cancelButtonCaption =
    showForm.lockSection || showForm.ctaUpgrade ? 'Maybe Later' : ''

  const showFooter = isOpen
  const isUnderLine = showForm.lockSection || showForm.ctaUpgrade

  return (
    <SappModalV3
      open={isOpen}
      handleCancel={handleClose}
      onOk={handleOk}
      handleClose={showFooter ? handleClose : undefined}
      icon={icon}
      header={header}
      content={content}
      showFooter={showFooter}
      okButtonCaption={okButtonCaption}
      cancelButtonCaption={cancelButtonCaption}
      showCancelButton={showFooter}
      fullWidthBtn={true}
      buttonSize="medium"
      isClosable={showFooter}
    />
  )
}

export default PopupLockContent
