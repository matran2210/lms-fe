import { ConfirmIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { trackGAEvent } from '@utils/google-analytics'

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
  const onClose = () => {
    setOpen(false)
  }
  return (
    <SappModalV2
      open={open}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      okButtonClass="!text-base"
      cancelButtonClass="!text-base"
      handleCancel={onCancel}
      onOk={onSubmit}
      title={''}
      showFooter={false}
    >
      <div className="mx-auto flex w-max items-center justify-center rounded-full bg-secondary p-8">
        <ConfirmIcon />
      </div>
      <div className="mt-6 flex justify-center text-4xl font-semibold text-bw-1">
        Confirm Submission
      </div>
      <div className="mb-11 mt-4 text-center text-sm font-normal text-gray-1">
        {message ??
          'Are you sure you are done here and ready to view the report?'}
      </div>
      <div className="relative pt-5 md:pt-5">
        <div className="flex flex-col-reverse gap-6">
          <SappButton
            title="Cancel"
            size="medium"
            color="textUnderline"
            className="w-full"
            onClick={onCancel}
          />
          <SappButton
            title={'Submit'}
            size="medium"
            className="h-12.5 w-full"
            onClick={onSubmit}
          />
        </div>
      </div>
    </SappModalV2>
  )
}

export default ConFirmSubmit
