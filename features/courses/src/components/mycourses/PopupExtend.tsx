import { AlertIcon, LockIcon } from '@assets/icons'
import { SappModalV3 } from '@lms/ui'
import { onLinkSocial } from '@lms/utils'
import { Dispatch, SetStateAction } from 'react'
import { MY_COURSES } from '@lms/core'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  extendCourse: () => void
  extend_count: number
}

const PopupExtend = ({ open, setOpen, extendCourse, extend_count }: IProps) => {
  /**
   * @description function này sẽ extend khóa học lần đầu tiên và đóng popup lại
   */
  const onExtendCourse = () => {
    extendCourse()
    setOpen(false)
  }

  /**
   * @description check điều kiện xem khóa đã extend bao nhiêu lần
   */
  const noExtensions = extend_count === 0

  // CSS classes to avoid duplication
  const textBaseClasses = 'text-base font-normal leading-normal text-gray-800'
  const linkClasses =
    'text-primary cursor-pointer text-base font-bold leading-normal'

  const modalIcon = noExtensions ? <AlertIcon /> : <LockIcon />
  const okButtonCaption = noExtensions ? 'Confirm' : 'Back to my course'
  const cancelButtonCaption = noExtensions ? 'Cancel' : ''
  const handleOk = noExtensions ? onExtendCourse : () => setOpen(false)

  const ContentExtendTrialCourse = () =>
    noExtensions ? (
      <div className={textBaseClasses}>
        This is your final course extension. Would you like to extend it now?
      </div>
    ) : (
      <div className="justify-center self-stretch text-center">
        <span className={textBaseClasses}>
          You can only extend a trial course once. For further support, please
          contact SAPP Academy via{' '}
        </span>
        <span
          onClick={() => onLinkSocial('https://www.facebook.com/sapp.edu.vn')}
          className={linkClasses}
        >
          Facebook,
        </span>
        <span
          onClick={() => onLinkSocial('https://zalo.me/3938733079901781176')}
          className={linkClasses}
        >
          {' '}
          Zalo
        </span>
        <span className={textBaseClasses}> or hotline </span>
        <span className={linkClasses}>{MY_COURSES.hotline}</span>
      </div>
    )

  return (
    <SappModalV3
      open={open}
      handleCancel={() => setOpen(false)}
      onOk={handleOk}
      icon={modalIcon}
      header="Extend Trial Course"
      content={<ContentExtendTrialCourse />}
      showFooter
      okButtonCaption={okButtonCaption}
      fullWidthBtn
      buttonSize="medium"
      cancelButtonCaption={cancelButtonCaption}
      isUnderLine
    />
  )
}

export default PopupExtend
