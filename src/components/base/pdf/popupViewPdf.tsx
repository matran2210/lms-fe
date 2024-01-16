import { ConfirmIcon } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import dynamic from 'next/dynamic'
import { memo } from 'react'

interface IProps {
  open: boolean
  setOpen: any
  url: string
}
const PopupViewPdf = ({ open, setOpen, url }: IProps) => {
  const PDFViewer = dynamic(() => import('../pdf/pdf-viewer'), {
    ssr: false,
  })
  const onSubmit = () => {
    setOpen({ status: false, url: undefined })
    //to do: start test
  }
  const onCancel = () => {}
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      isContentFull
      //   cancelButtonCaption="Quit"
      okButtonCaption="OK"
      handleCancel={onCancel}
      handleSubmit={onSubmit}
      showCancelButton={false}
      showHeader={false}
      refClass="md:px-19 py-19 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all"
      size=""
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
    >
      {/* <div className="p-11">
        <ConfirmIcon />
      </div>
      <div className="text-bw-1 text-4xl font-bold mt-6">
        Confirm Submission
      </div>
      <div className="text-gray-1 text-sm font-normal mt-4 mb-7 text-center">
        Are you sure you are done here and ready to view the report?
      </div> */}
      <PDFViewer file={url} />
    </SappModal>
  )
}

export default memo(PopupViewPdf)
