import { AlertTriagle } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { trackGAEvent } from '@utils/google-analytics'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleQuit: () => void
  handleCancel: () => void
}
const QuitTestModal = ({ open, setOpen, handleQuit, handleCancel }: IProps) => {
  const onSubmit = () => {
    setOpen(false)
    handleQuit()
    trackGAEvent('Click Button Quit Modal Test')
  }

  const onCancel = () => {
    handleCancel()
    setOpen(false)
    trackGAEvent('Click Button Cancel Modal Test')
  }

  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      cancelButtonCaption="Cancel"
      okButtonCaption="Quit"
      handleCancel={onCancel}
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
      revertFunction={true}
    >
      <div className="p-8 rounded-full bg-secondary">
        <AlertTriagle />
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6">Are you sure?</div>
      <div className="text-gray-1 text-medium-sm font-normal mt-4 mb-7 text-center">
        If you quit at this time, the test results will not be saved
      </div>
    </SappModal>
  )
}

export default QuitTestModal
