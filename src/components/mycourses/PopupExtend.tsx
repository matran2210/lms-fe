import { AlertIcon } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { MY_COURSES } from 'src/constants/lang'

interface IProps {
  open: boolean
  setOpen: any
}
const PopupExtend = ({ open, setOpen }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Back to My Course"
      //   handleCancel={onCancel}
      onOk={onOk}
      handleCancel={onOk}
      showCancelButton={false}
      showHeader={false}
      refClass="p-6 md:p-8 3xl:py-[70px] 3xl:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
      confirmOnclose={false}
      title={undefined}
    >
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto mb-6">
        <AlertIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold text-center">
        Expired Course
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-1 xl:mb-7 px-1">
        You can only extend a trial course once, please contact our Support at{' '}
        {MY_COURSES.hotline}.
      </div>
    </SappModalV2>
  )
}

export default PopupExtend
