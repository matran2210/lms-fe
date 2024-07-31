import { ConfirmIcon } from '@assets/icons'
import SappButton from '@components/base/button/SappButton'
import SappModalV2 from '@components/base/modal/SappModalV2'
import { trackGAEvent } from '@utils/google-analytics'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
  handleCancel: any
}
const ConFirmSubmit = ({
  open,
  setOpen,
  handleSubmit,
  handleCancel,
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
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto">
        <ConfirmIcon />
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6 flex justify-center">
        Confirm Submission
      </div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-11 text-center">
        Are you sure you are done here and ready to view the report?
      </div>
      <div className="md:pt-5 pt-5 relative">
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
            className="w-full h-12.5"
            onClick={onSubmit}
          />
        </div>
      </div>
    </SappModalV2>
  )
}

export default ConFirmSubmit
