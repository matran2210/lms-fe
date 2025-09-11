import DefaultBgImgHeader from '@assets/images/default_bg_mkt_in_app.png'
import { memo } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'

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
          <Image src={dashboardTab} alt="bgImgFooter" />
          <NavigationBarMKTInApp />
        </div>
        <div className="rotate-180">
          <Image src={DefaultBgImgHeader} height={377} alt="bgImgFooter" />
        </div>
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
