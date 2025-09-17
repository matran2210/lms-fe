import { memo } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'
import FooterMarketingInApp from '@components/marketing-in-app/FooterMarketingInApp'
import BgHomeMktInApp from '@assets/images/bg_home_mkt.png'
import SliderHome from '@components/marketing-in-app/SliderHome'
import clsx from 'clsx'

type LayoutTeacherProps = {
  title: string
  dashboardTab: {
    src: string
    title: string
    value: string
    height: number
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

      <div
        className={clsx(
          'relative w-screen',
          dashboardTab.value === 'home' && 'h-screen overflow-hidden',
          dashboardTab.value !== 'home' && ' min-h-screen overflow-y-auto',
        )}
      >
        <Image
          src={dashboardTab.src}
          alt={dashboardTab.title}
          priority
          layout={dashboardTab.value === 'home' ? 'fill' : 'responsive'}
          objectFit={dashboardTab.value === 'home' ? 'cover' : undefined}
          width={dashboardTab.value !== 'home' ? 1920 : undefined}
          height={
            dashboardTab.value !== 'home' ? dashboardTab.height : undefined
          }
        />
        <NavigationBarMKTInApp />
        {dashboardTab.value === 'home' ? (
          <div className="absolute bottom-5 left-1/2 z-10 w-full -translate-x-1/2 px-25">
            <SliderHome />
          </div>
        ) : (
          <>
            <FooterMarketingInApp />
          </>
        )}
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
