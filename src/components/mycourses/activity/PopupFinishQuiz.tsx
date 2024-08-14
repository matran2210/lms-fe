import { ActiveIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
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
      <div className="text-2xl font-semibold text-bw-1 md:text-4xl">
        Finish quiz?
      </div>
      <div className="mb-11 mt-4 text-center text-medium-sm text-gray-1">
        Are you sure you want to Finish this quiz?
      </div>
    </SappModal>
  )
}

export default PopupFinishQuiz
