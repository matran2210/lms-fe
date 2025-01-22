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
  // const onSubmit = () => {
  //   setOpen({ status: false, url: undefined })
  //   //to do: start test
  // }
  const onCancel = () => {
    setOpen({ status: false, url: undefined })
  }
  return (
    <SappModal
      open={open}
      setOpen={setOpen}
      isContentFull
      //   cancelButtonCaption="Quit"
      //   okButtonCaption="OK"
      handleCancel={onCancel}
      //   handleSubmit={onSubmit}
      showCancelButton={false}
      showOkButton={false}
      showHeader={true}
      refClass="md:px-8 pt-4 flex flex-col animate-jump-in relative transform bg-white text-left shadow-xl transition-all w-[75vh] h-full"
      size=""
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      fullWidthBtn={true}
      closeAfterSubmit={true}
      buttonSize="extra"
      showCloseIcon
    >
      <div className="h-[calc(100vh-6.5rem)] w-full">
        <PDFViewer file={url} />
      </div>
    </SappModal>
  )
}

export default memo(PopupViewPdf)
