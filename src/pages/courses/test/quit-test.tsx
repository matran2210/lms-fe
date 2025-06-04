import { AlertTriagle } from '@assets/icons'
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
      cancelButtonCaption="Cancel"
      okButtonCaption="Quit"
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<AlertTriagle />}
      header="Are you sure?"
      content="If you quit now, your answers will be saved and the timer will continue running. You can come back later to resume the test."
    />
  )
}

export default QuitTestModal
