import { ActiveIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

interface IProps {
  open: boolean
  setOpen: any
  submitQuiz: () => void
}
const PopupFinishQuiz = ({ open, setOpen, submitQuiz }: IProps) => {
  const handleCancel = () => {
    setOpen(false)
  }
  const onOk = () => {
    setOpen(false)
    submitQuiz()
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Submit"
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
        Finish quiz?
      </div>
      <div className="text-medium-sm text-gray-1 text-center mt-4 mb-11">
        Are you sure you want to Finish this quiz?
      </div>
    </SappModal>
  )
}

export default PopupFinishQuiz
