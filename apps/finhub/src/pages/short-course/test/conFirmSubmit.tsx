import { ArrowLeftIcon, ConfirmIcon } from '@assets/icons'
import { SappModalV3 } from '@lms/ui'
import { trackGAEvent } from '@lms/utils'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleCancel: any
  message?: String
}
const ConFirmSubmit = ({
  open,
  setOpen,
  handleSubmit,
  handleCancel,
  message,
}: IProps) => {
  const onSubmit = () => {
    handleSubmit()
    trackGAEvent('Click Button Submit Modal Confirm Quiz Activity')
  }
  const onCancel = () => {
    handleCancel()
    setOpen(false)
    trackGAEvent('Click Button Cancel Modal Confirm Quiz Activity')
  }

  return (
    <SappModalV3
      open={open}
      cancelButtonCaption="Back to My Course"
      okButtonCaption="Submit"
      showCancelButton={true}
      handleCancel={onCancel}
      onOk={onSubmit}
      fullWidthBtn={true}
      buttonSize="medium"
      icon={<ConfirmIcon />}
      header="Confirm Submission"
      content={
        message ??
        'Are you sure you are done here and ready to view the report?'
      }
      maskClosable={false}
      startIcon={<ArrowLeftIcon />}
    />
  )
}

export default ConFirmSubmit
