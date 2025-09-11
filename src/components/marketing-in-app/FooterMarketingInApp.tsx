import DefaultBgImgFooter from '@assets/images/default_bg_footer_mkt_in_app.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
const FooterMarketingInApp = () => {
  const router = useRouter()
  return (
    <div className="relative">
      <Image
        src={DefaultBgImgFooter}
        height={377}
        alt="bgImgFooter"
        className="w-full"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
        <div className="text-center text-[32px] font-semibold leading-[46px] text-white">
          Khám phá ngay Student Dashboard mới trong LMS Version 2 và <br />
          trải nghiệm học tập hiệu quả hơn!
        </div>
        <div
          className="cursor-pointer rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary"
          onClick={() => {
            router.push('/')
          }}
        >
          Khám phá ngay
        </div>
      </div>
    </div>
  )
}

export default FooterMarketingInApp
