const SlickSlider: any =
  (require('react-slick') as any).default || require('react-slick')
import Image from 'next/image'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const SliderHome = () => {
  const { isMobileView, isTabletView } = useTailwindBreakpoint()
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobileView ? '12px' : isTabletView ? '24px' : '40px',
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
  }
  const widthImg = isMobileView ? 255 : isTabletView ? 350 : 390
  const heightImg = isMobileView ? 97 : isTabletView ? 200 : 310

  return (
    <SlickSlider {...settings}>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
      <div>
        <Image
          className="rounded-lg md:rounded-2xl"
          src="https://cdn.sapp.edu.vn/icons/img_header_modal_mkt_in_app.png"
          width={widthImg}
          height={heightImg}
          alt="default_bg_mkt_in_app"
          priority
        />
      </div>
    </SlickSlider>
  )
}

export default SliderHome
