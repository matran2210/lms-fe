import { CloseIconPreview } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import MyProfileAPI from 'src/pages/api/profile'
import SappModalCerti from './CertificatePopup'

interface PopupProp {
  openPreview: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  data: any
  id: any
  message: string
  confirmOnClose?: boolean
  onClose: () => void
  userDetail: string
}

const PopUpCertificate = ({
  id,
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
      title={data?.name ?? 'Preview Certification'}
      size="max-w-[614px] min-w-[400px] min-h-[700px]"
      footerButtonClassName="flex flex-col-reverse gap-6"
      childClass="flex flex-col justify-center items-center"
      parentChildClass=""
      position="center"
      buttonSize="extra"
    >
      <div className="max-w-[614px] min-w-[500px] min-h-[700px] ">
        <div className="border-b border-solid border-[#f8f8f8] w-full flex justify-between">
          <div className=" flex text-xl font-sans font-medium leading-[25px] text-[#404041] w-[419px] pb-4">
            {data?.certificate.name}
          </div>
          <div className="cursor-pointer" onClick={handleOnClose}>
            <CloseIconPreview />
          </div>
        </div>
        {/* <div>{data?.certificate_url}</div> */}
        <div className="flex justify-center pt-20">
          <img
            src={data?.certificate_url}
            className=" min-w-[500px] min-h-[400px]"
          ></img>
        </div>
      </div>
    </SappModalCerti>
  )
}
export default PopUpCertificate
