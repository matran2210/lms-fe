import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import SappModalV2 from '@components/base/modal/SappModalV2'

interface IProps {
  open: boolean
  setOpen: any
}
const PopupLesson = ({ open, setOpen }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      okButtonCaption="Back to My Course"
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
      <div className="mx-auto mb-6 flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <AlertIcon />
      </div>
      <div className="flex justify-center text-2xl font-semibold text-bw-1 md:text-4xl">
        Foundation Required
      </div>
      <div className="mb-1 mt-4 px-1 text-center text-medium-sm text-gray-1 xl:mb-7">
        Please pass the Foundation Class to activate this course.
      </div>
    </SappModalV2>
  )
}

export default PopupLesson
