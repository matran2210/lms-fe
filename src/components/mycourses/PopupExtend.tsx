import { AlertIcon, LockIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { onLinkSocial } from '@utils/index'
import { Dispatch, SetStateAction } from 'react'
import { MY_COURSES } from 'src/constants/lang'

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

  return (
    <SappModalV2
      open={open}
      okButtonCaption={noExtensions ? 'Confirm' : 'Back to My Course'}
      onOk={noExtensions ? () => onExtendCourse() : () => setOpen(false)}
      handleCancel={() => setOpen(false)}
      showCancelButton={noExtensions}
      showHeader={false}
      refClass="p-6 md:p-8 3xl:py-[70px] 3xl:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      parentChildClass=""
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
        {noExtensions ? <AlertIcon /> : <LockIcon />}
      </div>
      <div className="text-center text-2xl font-semibold text-[#050505] md:text-4xl">
        Extend Trial Course
      </div>
      {noExtensions ? (
        <div className="mb-1 mt-4 px-1 text-center text-sm xl:mb-7">
          <span className="text-[#A1A1A1]">
            This is your final course extension. Would you like to extend it
            now?
          </span>
        </div>
      ) : (
        <div className="mb-1 mt-4 px-1 text-center text-sm xl:mb-7">
          <span className="text-[#A1A1A1]">
            You can only extend a trial course once. For further support, please
            contact SAPP Academy via
          </span>{' '}
          <span
            className="cursor-pointer text-primary underline"
            onClick={() => onLinkSocial('https://www.facebook.com/sapp.edu.vn')}
          >
            Facebook
          </span>
          <span className="text-[#A1A1A1]">,</span>{' '}
          <span
            className="cursor-pointer text-primary underline"
            onClick={() => onLinkSocial('https://zalo.me/3938733079901781176')}
          >
            Zalo
          </span>{' '}
          <span className="text-[#A1A1A1]">or hotline</span>{' '}
          <span className="text-primary">{MY_COURSES.hotline}</span>
        </div>
      )}
    </SappModalV2>
  )
}

export default PopupExtend
