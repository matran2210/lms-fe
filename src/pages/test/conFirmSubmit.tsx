import { ConfirmIcon } from '@assets/icons'
import BackIcon from '@assets/icons/BackIcon'
import SappButton from '@components/base/button/SappButton'
import SappButtonIcon from '@components/base/button/SappButtonIcon'
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
      <div className="mx-auto flex w-max items-center justify-center rounded-full">
        <ConfirmIcon />
      </div>
      <div className="flex justify-center pb-8 pt-10 text-4xl font-semibold text-[#050505]">
        Confirm Submission
      </div>
      <div className="text-center text-base font-normal text-[#050505]">
        {message ??
          'Are you sure you are done here and ready to view the report?'}
      </div>
      <div className="relative pt-5 md:pt-10">
        <div className="flex flex-col gap-3">
          <SappButton
            title={'Submit'}
            size="medium"
            className="h-[50px] w-full"
            onClick={onSubmit}
          />
          <SappButtonIcon
            onClick={onCancel}
            ishover={false}
            className="flex w-full gap-2 border-none !p-0"
          >
            <BackIcon />
            <div className="text-base font-semibold text-gray-800 underline hover:text-primary">
              Back to My Course
            </div>
          </SappButtonIcon>
        </div>
      </div>
    </SappModalV2>
  )
}

export default ConFirmSubmit
