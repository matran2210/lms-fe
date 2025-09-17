const SlickSlider: any =
  (require('react-slick') as any).default || require('react-slick')
import { linkCdnMktInApp } from '@pages/marketing-in-app'
import Image from 'next/image'
import { useTailwindBreakpoint } from 'src/hooks/useTailwindBreakpoint'

const SliderHome = () => {
  const {
    isMobileView,
    isTabletView,
    is2XLView,
    is3XLView,
    is4XLView,
    isLargeDesktopView,
    isXLMiddleView,
    isAlwaysShowSidebar,
    isMDMiddleView,
  } = useTailwindBreakpoint()
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: isMDMiddleView || isTabletView ? 2 : isMobileView ? 1 : 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: isMobileView ? '12px' : isTabletView ? '24px' : '40px',
    autoplay: true,
    autoplaySpeed: 1500,
    initialSlide: 0,
    arrows: false,
  }

  const getWidthImg = () => {
    if (isMobileView) return 493
    if (isMDMiddleView) return 300
    if (isTabletView) return 250
    if (is2XLView) return 400
    if (is3XLView) return 450
    if (is4XLView) return 493
    if (isXLMiddleView) return 350
    if (isLargeDesktopView) return 320
    if (isAlwaysShowSidebar) return 250

    return 493
  }
  const getHeightImg = () => {
    if (isMobileView) return 310
    if (isMDMiddleView) return 189
    if (isTabletView) return 157
    if (is2XLView) return 252
    if (is3XLView) return 283
    if (is4XLView) return 310
    if (isXLMiddleView) return 220
    if (isLargeDesktopView) return 201
    if (isAlwaysShowSidebar) return 157
    return 310
  }
  const widthImg = getWidthImg()
  const heightImg = getHeightImg()
  const listSlides = [
    `${linkCdnMktInApp}/slider_home_1-min.png`,
    `${linkCdnMktInApp}/slider_home_2-min.png`,
    `${linkCdnMktInApp}/slider_home_3-min.png`,
    `${linkCdnMktInApp}/slider_home_4-min.png`,
    `${linkCdnMktInApp}/slider_home_5-min.png`,
    `${linkCdnMktInApp}/slider_home_6-min.png`,
    `${linkCdnMktInApp}/slider_home_7-min.png`,
    `${linkCdnMktInApp}/slider_home_8-min.png`,
  ]

  return (
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
  )
}

export default SliderHome
