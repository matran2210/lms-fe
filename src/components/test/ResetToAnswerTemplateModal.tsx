import { AlertTriagle } from '@assets/icons'
import SappModalV3 from '@components/base/modal/SappModalV3'
import { Dispatch, SetStateAction } from 'react'

interface IProps {
  open: boolean
  handleReset: () => void
  handleClose: () => void
}

const ResetToAnswerTemplateModal = ({
  open,
  handleReset,
  handleClose,
}: IProps) => {
  const onSubmit = () => {
    handleReset()
    handleClose()
  }

  return (
    <SappModalV3
      open={open}
      cancelButtonCaption="Keep Doing"
      okButtonCaption="Confirm"
      handleCancel={handleClose}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="extra"
      icon={<AlertTriagle />}
      header="Are you sure?"
      content={
        'Are you sure you want to reset the template? If you do, all of your previous work will be deleted and you will have to start over.'
      }
    />
  )
}

export default ResetToAnswerTemplateModal
