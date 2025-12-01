import type { ComponentType } from 'react'
import type { Settings } from 'react-slick'
// Use require to avoid type conflicts between react-slick types and React types
// const SlickSlider: ComponentType<Settings> =
//   (require('react-slick') as { default?: ComponentType<Settings> }).default ??
//   (require('react-slick') as ComponentType<Settings>)
import ReactSlick from 'react-slick'
const SlickSlider = ReactSlick as unknown as ComponentType<Settings>
import Image from 'next/image'
import { ButtonPrimary } from '@lms/ui'
import { ButtonText } from '@lms/ui'
import { Dispatch, SetStateAction } from 'react'
import { useTailwindBreakpoint } from '@lms/hooks'
import { linkCdnMktInApp } from '@pages/lms-pro-new-version'
import { motion, AnimatePresence } from 'framer-motion'

const ModalMarketingInApp = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const { isMobileView, isTabletView, isShortScreen } = useTailwindBreakpoint()
  const widthModal = isShortScreen
    ? 679
    : isMobileView
      ? 335
      : isTabletView
        ? 600
        : 900
  const widthImg = isShortScreen
    ? 574
    : isMobileView
      ? 265
      : isTabletView
        ? 505
        : 776
  const heightImg = isShortScreen
    ? 202
    : isMobileView
      ? 97
      : isTabletView
        ? 182
        : 310

  const handleClose = () => {
    setOpen(false)
    localStorage.setItem('openModalMarketingInApp', 'true')
  }

  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobileView ? '8px' : isTabletView ? '12px' : '16px',
    autoplay: true,
    autoplaySpeed: 2000,
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
    <AnimatePresence>
      {open && (
        <>
          {/* overlay */}
          <motion.div
            className="fixed inset-0 z-[1050] bg-overlay-control"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* hiệu ứng grow */}
          <motion.div
            className="modal-marketing-in-app"
            initial={{
              scale: 0,
              opacity: 0,
              bottom: 160, // start ở bottom-40
              right: 16, // start ở right-16
              transformOrigin: 'bottom right',
              x: 0,
              y: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              top: '50%', // animate tới top 50%
              left: '50%', // animate tới left 50%
              // dịch để căn giữa chính xác theo kích thước element
              x: '-50%',
              y: '-50%',
            }}
            exit={{
              scale: 0,
              opacity: 0,
              top: 'auto',
              left: 'auto',
              bottom: 160,
              right: 16,
              x: 0,
              y: 0,
              transition: {
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1],
              },
            }}
            transition={{
              duration: 0.3,
            }}
            style={{
              width: widthModal,
              transformOrigin: 'bottom right',
            }}
          >
            {/* Giữ nguyên phần nội dung modal */}

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
            <div className="flex flex-col items-center justify-center pt-6 lg:px-[120px] lg:pt-8 short:px-[20px] short:pt-4">
              <div className="self-stretch text-center text-2xl font-bold text-gray-800 md:leading-[34px] lg:text-[32px] lg:leading-[46px] short:text-2xl">
                SAPP LMS has updated to a new version.
              </div>

              <div className="mt-4 self-stretch text-center text-sm font-normal leading-normal text-gray-800 md:text-base lg:mt-6">
                We’ve been listening. This update brings you a cleaner look,
                improved performance, and smarter learning tools, all designed
                with you in mind to create a seamless and engaging learning
                experience.
              </div>

              <div className="mt-6 flex w-full flex-col items-center justify-center gap-3 md:mt-8 md:px-10 lg:mt-10 lg:px-[100px] short:mt-6 short:lg:px-[145px]">
                <ButtonPrimary
                  title="Explore now"
                  className="w-full"
                  size={
                    isMobileView || isTabletView || isShortScreen
                      ? 'small'
                      : 'medium'
                  }
                  onClick={() => {
                    handleClose()
                    if (!isMobileView)
                      window.open('/lms-pro-new-version', '_blank')
                  }}
                />
                {!isMobileView && (
                  <ButtonText
                    size={isTabletView || isShortScreen ? 'small' : 'medium'}
                    onClick={handleClose}
                    title="Skip"
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ModalMarketingInApp
