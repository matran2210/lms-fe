import { AlertTriagle } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { trackGAEvent } from '@utils/google-analytics'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  content: string
  setOpen: Dispatch<SetStateAction<boolean>>
  handleQuit: () => void
  handleCancel: () => void
}

const QuitTestModalTeacher = ({
  open,
  content,
  setOpen,
  handleQuit,
  handleCancel,
}: IProps) => {
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
      content={content}
    />
  )
}

export default QuitTestModalTeacher
