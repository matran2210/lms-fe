import { memo } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'
import FooterMarketingInApp from '@components/marketing-in-app/FooterMarketingInApp'

type LayoutTeacherProps = {
  title: string
  dashboardTab: string
}

const LayoutMarketingInApp: React.FC<LayoutTeacherProps> = ({
  title = '',
  dashboardTab,
}: LayoutTeacherProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="min-h-screen w-full bg-white">
        <div className="relative min-h-screen w-screen overflow-y-auto">
          <Image
            src="https://cdn.sapp.edu.vn/icons/bg_dashboard_mkt.png"
            alt="bg dashboard"
            layout="responsive" // Next 12: responsive = width 100%, height auto
            width={1920} // tỉ lệ gốc ảnh
            height={6170} // tỉ lệ gốc ảnh
            priority
          />
          <NavigationBarMKTInApp />
          {/* <FooterMarketingInApp /> */}
        </div>
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
