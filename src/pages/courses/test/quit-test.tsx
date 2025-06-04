import { AlertTriagle } from '@assets/icons'
import QuizIcon from '@assets/icons/QuitIcon'
import SappModalV3 from '@components/base/modal/SappModalV3'
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
    <SappModalV3
      open={open}
      cancelButtonCaption="Quit Anyway"
      okButtonCaption="Cancel"
      handleCancel={onSubmit}
      onOk={onCancel}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<QuizIcon />}
      header="Are you sure?"
      content="If you quit at this time, the test results will not be saved"
      cancelButtonClass="underline !p-0 !w-fit hover:text-primary"
    />
  )
}

export default QuitTestModal
