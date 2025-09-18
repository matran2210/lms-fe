import { Modal } from 'antd'
import type { ComponentType } from 'react'
import type { Settings } from 'react-slick'
// Use require to avoid type conflicts between react-slick types and React types
const SlickSlider: ComponentType<Settings> =
  (require('react-slick') as { default?: ComponentType<Settings> }).default ??
  (require('react-slick') as ComponentType<Settings>)
import Image from 'next/image'
import ButtonPrimary from '@components/base/button/ButtonPrimary'
import ButtonText from '@components/base/button/ButtonText'
import { Dispatch, SetStateAction } from 'react'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'
import { linkCdnMktInApp } from '@pages/marketing-in-app'

const ModalMarketingInApp = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { isMobileView, isTabletView } = useTailwindBreakpoint()
  const widthModal = isMobileView ? 335 : isTabletView ? 600 : 1000
  const widthImg = isMobileView ? 255 : isTabletView ? 480 : 816
  const heightImg = isMobileView ? 97 : isTabletView ? 182 : 310

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem('openModalMarketingInApp', 'true')
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobileView ? '12px' : isTabletView ? '24px' : '40px',
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
    arrows: false,
  }

  const listSlides = [
    `${linkCdnMktInApp}/slider_modal_1_min.png`,
    `${linkCdnMktInApp}/slider_modal_2_min.png`,
    `${linkCdnMktInApp}/slider_modal_3_min.png`,
    `${linkCdnMktInApp}/slider_modal_4_min.png`,
  ]

  return (
    <Modal
      width={widthModal}
      footer={false}
      open={open}
      centered
      closeIcon={false}
      rootClassName="modal-marketing-in-app"
    >
      <SlickSlider {...settings}>
        {listSlides.map((src, index) => (
          <div key={index}>
            <Image
              className="rounded-lg md:rounded-2xl"
              src={src}
              width={widthImg}
              height={heightImg}
              alt={`slide-${index}`}
              priority
            />
          </div>
        ))}
      </SlickSlider>

      <div className="flex flex-col items-center justify-center pt-6 lg:px-[120px] lg:pt-8">
        <div className="self-stretch text-center text-2xl font-bold text-gray-800 md:leading-[34px] lg:text-[32px] lg:leading-[46px]">
          SAPP LMS has updated to a new version.
        </div>

        <div className="mt-4 self-stretch text-center text-sm font-normal leading-normal text-gray-800 md:text-base lg:mt-6">
          We’ve just upgraded to a brand-new version of SAPP LMS. This update
          brings a smoother interface, improved performance, and new features
          designed to make your learning journey easier and more engaging.
        </div>

        <div className="mt-6 flex w-full flex-col items-center justify-center gap-3  md:mt-8 md:px-10 lg:mt-10 lg:px-[100px]">
          <ButtonPrimary
            title="Explore now"
            className="w-full"
            size={isMobileView || isTabletView ? 'small' : 'medium'}
            onClick={() => {
              handleClose()
              window.open('/marketing-in-app', '_blank') // mở tab mới
            }}
          />
          <ButtonText
            size={isMobileView || isTabletView ? 'small' : 'medium'}
            onClick={handleClose}
            title="Skip"
          />
        </div>
      </div>
    </Modal>
  )
}

export default ModalMarketingInApp
