import { CloseIconPreview } from '@assets/icons'
import SappModal from '@components/base/modal/SappModal'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction } from 'react'

interface PopupProp {
  openPreview: boolean
  setOpenModal: Dispatch<SetStateAction<boolean>>
  data: any
  id: any
  message: string
  confirmOnClose?: boolean
  onClose: () => void
}

const PopUpCertificate = ({
  id,
  openPreview,
  setOpenModal,
  data,
  message,
  onClose,
  confirmOnClose = true,
}: PopupProp) => {
  const router = useRouter()
  const handleOnClose = () => {
    onClose()
  }
  return (
    <SappModal
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
      <div className="max-w-[614px] min-w-[500px] min-h-[700px]  ">
        <div className="border-b border-b-inherit w-full flex justify-between">
          <div>{data.certificate.name}</div>
          <div className="cursor-pointer" onClick={handleOnClose}>
            <CloseIconPreview />
          </div>
          <div>{data.certificate.name}</div>
        </div>
      </div>
    </SappModal>
  )
}
export default PopUpCertificate
