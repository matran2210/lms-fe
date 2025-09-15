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

      <div className="relative min-h-screen w-screen overflow-y-auto overflow-x-hidden">
        <div className="max-w-full">
          <Image
            src="https://cdn.sapp.edu.vn/icons/bg_dashboard_mkt.png"
            alt="bg dashboard"
            layout="responsive"
            width={1920}
            height={6170}
            priority
          />
        </div>
        <NavigationBarMKTInApp />
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
