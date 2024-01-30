import { ActiveIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

interface IProps {
  open: boolean
  setOpen: any
  activeCourse: () => void
  time?: number
}
const PopupActive = ({ open, setOpen, activeCourse, time = 60 }: IProps) => {
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
    >
      <div className="mb-6">
        <ActiveIcon />
      </div>
      <div className="text-2xl md:text-4xl text-bw-1 font-semibold">
        Active Course?
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-1 2xl:mb-11">
        You will have {time} {time > 1 ? 'days' : 'day'} from the activation
        date to study this course
      </div>
    </SappModal>
  )
}

export default PopupActive
