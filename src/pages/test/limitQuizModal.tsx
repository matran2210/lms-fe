import { AlertTriagle } from '@assets/icons'
import SappModalV2 from '@components/base/modal/SappModalV2'
import SappModalV3 from '@components/base/modal/SappModalV3'

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
    <SappModalV3
      open={open}
      showCancelButton={false}
      okButtonCaption="Quit"
      onOk={onSubmit}
      size="max-w-[646px]"
      fullWidthBtn={true}
      buttonSize="extra"
      handleCancel={onCancel}
      icon={<AlertTriagle />}
      header="Quiz limit exceded"
    />
  )
}

export default LimitQuizModal
