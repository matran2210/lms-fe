import DefaultBgImgFooter from '@assets/images/default_bg_footer_mkt_in_app.png'
import Image from 'next/image'
import { useRouter } from 'next/router'
const FooterMarketingInApp = () => {
  const router = useRouter()
  return (
    <div className="absolute inset-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center">
      <div
        className="cursor-pointer rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary"
        onClick={() => {
          router.push('/')
        }}
      >
        Khám phá ngay
      </div>
    </div>
  )
}

export default FooterMarketingInApp
