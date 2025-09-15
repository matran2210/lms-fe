import { memo } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'
import FooterMarketingInApp from '@components/marketing-in-app/FooterMarketingInApp'

type LayoutTeacherProps = {
  title: string
  dashboardTab: {
    src: string
    title: string
    value: string
  }
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

      <div className="relative min-h-screen w-screen overflow-y-auto">
        <div className="max-w-full">
          <Image
            src={dashboardTab.src}
            alt={dashboardTab.title}
            layout="responsive"
            width={1920}
            height={6170}
            priority
          />
        </div>
        <NavigationBarMKTInApp />
        <FooterMarketingInApp />
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
