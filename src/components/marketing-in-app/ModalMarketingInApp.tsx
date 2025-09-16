import { Modal, Carousel } from 'antd'
// Use require to avoid type conflicts between react-slick types and React types
const SlickSlider: any =
  (require('react-slick') as any).default || require('react-slick')
import Image from 'next/image'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import { Dispatch, SetStateAction } from 'react'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
const settings = {
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  centerMode: true,
  centerPadding: '40px',
  autoplay: true,
  autoplaySpeed: 2000,
  initialSlide: 0,
}
const ModalMarketingInApp = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { isMobileView, isTabletView } = useTailwindBreakpoint()
  const widthModal = isMobileView ? 343 : isTabletView ? 600 : 1000
  const widthImg = isMobileView ? 343 : isTabletView ? 600 : 816
  const heightImg = isMobileView ? 170 : isTabletView ? 300 : 310
  return (
    <Modal
      width={widthModal}
      footer={false}
      open={isMobileView ? false : open}
      centered
      closeIcon={false}
      rootClassName="modal-marketing-in-app"
    >
      <SlickSlider {...settings}>
        <div>
          <Image
            className="rounded-2xl"
            src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
            width={widthImg}
            height={heightImg}
            alt="default_bg_mkt_in_app"
            priority
          />
        </div>
        <div>
          <Image
            className="rounded-2xl"
            src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
            width={widthImg}
            height={heightImg}
            alt="default_bg_mkt_in_app"
            priority
          />
        </div>
        <div>
          <Image
            className="rounded-2xl"
            src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
            width={widthImg}
            height={heightImg}
            alt="default_bg_mkt_in_app"
            priority
          />
        </div>
      </SlickSlider>

      <div className="flex flex-col items-center justify-center p-6 md:p-8 lg:px-[200px] lg:py-[56px]">
        <div className="self-stretch text-center text-base font-bold leading-7 text-gray-800 md:text-2xl md:leading-[34px] lg:text-[32px] lg:leading-[46px]">
          SAPP LMS has updated to a new version.
        </div>

        <div className="self-stretch text-center text-xs font-normal leading-normal text-gray-800 md:mt-4 md:text-base lg:mt-6">
          We’ve just upgraded to a brand-new version of SAPP LMS. This update
          brings a smoother interface, improved performance, and new features
          designed to make your learning journey easier and more engaging.
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-3 px-0 sm:px-6 md:mt-8 md:px-10 lg:mt-10 lg:px-[100px]">
          <ButtonPrimary
            title="Explore now"
            className="w-full lg:text-lg"
            size={isMobileView || isTabletView ? 'small' : 'medium'}
            onClick={() => {
              window.open('/marketing-in-app', '_blank') // mở tab mới
            }}
          />
          <ButtonText
            size={isMobileView || isTabletView ? 'small' : 'medium'}
            onClick={() => {
              setOpen(false)
              localStorage.setItem('openModalMarketingInApp', 'true')
            }}
            className="lg:text-lg"
            title="Skip"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalMarketingInApp
