import { ConfirmIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'

interface IProps {
  open: boolean
  setOpen: any
  handleSubmit: any
}
const ConFirmSubmit = ({ open, setOpen, handleSubmit }: IProps) => {
  const onSubmit = () => {
    handleSubmit()
    //to do: start test
  }
  const onCancel = () => {
    setOpen(false)
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      //   cancelButtonCaption="Quit"
      okButtonCaption="Submit"
      handleCancel={onCancel}
      handleSubmit={onSubmit}
      //   showCancelButton={false}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size="max-w-[614px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
    >
      <div className="p-11">
        <ConfirmIcon />
      </div>
      <div className="text-bw-1 text-4xl font-bold mt-6">
        Confirm Submission
      </div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-7 text-center">
        Are you sure you are done here and ready to view the report?
      </div>
    </SappModal>
  )
}

export default ConFirmSubmit
