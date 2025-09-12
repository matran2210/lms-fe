import { Modal } from 'antd'
import Image from 'next/image'
import ImgHeaderModalMktInApp from '@assets/images/img_header_modal_mkt_in_app.png'
import ButtonPrimaryV2 from '@components/base/button/ButtonPrimaryV2'
import ButtonTextV2 from '@components/base/button/ButtonTextV2'
import { Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'

const ModalMarketingInApp = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  return (
    <Modal
      width={1000}
      footer={false}
      open={open}
      centered
      closeIcon={false}
      rootClassName="modal-marketing-in-app"
    >
      <div>
        <Image
          className="rounded-t-3xl"
          src={ImgHeaderModalMktInApp}
          width={1000}
          height={380}
          alt="default_bg_mkt_in_app"
        />
      </div>
      <div className="flex flex-col items-center justify-center px-[200px] py-[56px]">
        <div className="justify-start self-stretch text-center text-[32px] font-bold leading-[46px] text-gray-800">
          SAPP LMS has updated to a new version.
        </div>
        <div className="mt-6 justify-center self-stretch text-center text-base font-normal leading-normal text-gray-800">
          We’ve just upgraded to a brand-new version of SAPP LMS. This update
          brings a smoother interface, improved performance, and new features
          designed to make your learning journey easier and more engaging.
        </div>
        <div className="mt-10 flex w-full flex-col items-center justify-center gap-3 px-[100px]">
          <ButtonPrimaryV2
            title="Explore now"
            className="w-full"
            onClick={() => {
              router.push('/marketing-in-app')
            }}
          />
          <ButtonTextV2
            size="medium"
            onClick={() => setOpen(false)}
            title="Skip"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalMarketingInApp
