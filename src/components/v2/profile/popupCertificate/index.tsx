import { CloseIconPreview } from '@assets/icons'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'
import SappModalCerti from './CertificatePopup'

interface PopupProp {
  openPreview: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  data: any
  message: string
  confirmOnClose?: boolean
  onClose: () => void
  userDetail: string
}

const PopUpCertificate = ({
  openPreview,
  setOpenModal,
  data,
  message,
  onClose,
  confirmOnClose = true,
  userDetail,
}: PopupProp) => {
  const router = useRouter()
  const handleOnClose = () => {
    onClose()
  }

  return (
    <SappModalCerti
      open={openPreview}
      setOpen={setOpenModal}
      showHeader={false}
      showFooter={false}
      title={data?.course?.name ?? 'Preview Certification'}
      size="max-w-[1200px] max-h-[1200px] w-fit h-fit"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      buttonSize="extra"
      isContentFull={true}
      scrollbale={false}
    >
      <div className="w-full">
        <div className="flex w-full justify-between border-b border-solid border-[#F1F1F1] pb-6">
          <div className=" flex w-full pr-4 font-sans text-xl font-medium leading-[25px] text-[#050505]">
            {data?.course?.name}
          </div>
          <div className="cursor-pointer" onClick={handleOnClose}>
            <CloseIconPreview />
          </div>
        </div>
        {/* <div>{data?.certificate_url}</div> */}
        <div className="flex justify-center pt-6">
          <img src={data?.certificate_url} className="h-auto w-full"></img>
        </div>
      </div>
    </SappModalCerti>
  )
}
export default PopUpCertificate
