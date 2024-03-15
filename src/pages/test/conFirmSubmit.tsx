import { ConfirmIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

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
    //to do: start test
  }
  const onCancel = () => {
    handleCancel()
    setOpen(false)
  }
  const onClose = () => {
    setOpen(false)
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      okButtonClass="!text-base"
      cancelButtonClass="!text-base"
      handleCancel={onCancel}
      handleSubmit={onSubmit}
      handleCloseOnly={onClose}
      //   showCancelButton={false}
      showHeader={false}
      refClass="p-6 md:p-8 3xl:py-[70px] 3xl:px-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[614px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      scrollbale={false}
    >
      <div className="p-8 rounded-full bg-secondary flex items-center justify-center w-max mx-auto">
        <ConfirmIcon />
      </div>
      <div className="text-bw-1 text-4xl font-semibold mt-6">
        Confirm Submission
      </div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-11 text-center">
        Are you sure you are done here and ready to view the report?
      </div>
    </SappModal>
  )
}

export default ConFirmSubmit
