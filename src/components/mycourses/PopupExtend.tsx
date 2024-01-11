import { AlertIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

interface IProps {
  open: boolean
  setOpen: any
}
const PopupExtend = ({ open, setOpen }: IProps) => {
  const onOk = () => {
    setOpen(false)
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Back to My Course"
      //   handleCancel={onCancel}
      handleSubmit={onOk}
      showCancelButton={false}
      showHeader={false}
      refClass="p-6 md:py-[70px] md:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all overflow-y-auto"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-8"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
    >
      <div className="mb-6">
        <AlertIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold">
        Expired Course
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-7">
        You can only extend a trial course of 1 time, please contact out support
        at 0889 662 276.
      </div>
    </SappModal>
  )
}

export default PopupExtend
