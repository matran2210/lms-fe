import { ActiveIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

interface IProps {
  open: boolean
  setOpen: any
  activeCourse: () => void
}
const PopupActive = ({ open, setOpen, activeCourse }: IProps) => {
  const handleCancel = () => {
    setOpen(false)
  }
  const onOk = () => {
    setOpen(false)
    activeCourse()
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Confirm"
      //   handleCancel={onCancel}
      handleSubmit={onOk}
      handleCancel={handleCancel}
      cancelButtonClass={'no-underline'}
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
        <ActiveIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold">
        Active Course?
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-11">
        You will have 60 days from the activation date to study this course
      </div>
    </SappModal>
  )
}

export default PopupActive
