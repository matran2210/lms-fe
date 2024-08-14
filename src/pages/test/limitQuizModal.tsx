import { AlertIcon, AlertTriagle } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { TimeIcon } from '@components/icons'
import { useEffect } from 'react'
import { useAppDispatch } from 'src/redux/hook'

interface IProps {
  open: boolean
  setOpen: any
  handleQuit: any
}
const LimitQuizModal = ({ open, setOpen, handleQuit }: IProps) => {
  const onSubmit = () => {
    setOpen(false)
    handleQuit()
    // handleSubmit()
    //to do: start test
  }
  const onCancel = () => {
    setOpen(false)
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      showCancelButton={false}
      okButtonCaption="Quit"
      handleSubmit={onSubmit}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[646px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={false}
      buttonSize="extra"
    >
      <div className="rounded-full bg-secondary p-8">
        <AlertTriagle />
      </div>
      <div className="mt-6 text-4xl font-semibold text-bw-1">
        Quiz limit exceded
      </div>
    </SappModal>
  )
}

export default LimitQuizModal
