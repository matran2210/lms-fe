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
        <div className="relative">
          <Image
            src={dashboardTab}
            alt="bgImg"
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
          />
          <NavigationBarMKTInApp />
        </div>
        <FooterMarketingInApp />
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
