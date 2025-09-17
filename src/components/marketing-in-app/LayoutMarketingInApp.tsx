import { memo } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'
import FooterMarketingInApp from '@components/marketing-in-app/FooterMarketingInApp'
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
  const isHome = dashboardTab.value === 'home'
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className={clsx(
          'relative w-screen',
          isHome && 'h-screen overflow-hidden',
          !isHome && 'min-h-screen overflow-y-auto',
        )}
      >
        <Image
          src={dashboardTab.src}
          alt={dashboardTab.title}
          priority
          layout={isHome ? 'fill' : 'responsive'}
          objectFit={isHome ? 'cover' : undefined}
          width={!isHome ? 1920 : undefined}
          height={!isHome ? dashboardTab.height : undefined}
        />
        <NavigationBarMKTInApp />
        {isHome ? (
          <div className="absolute bottom-32 left-1/2 w-full -translate-x-1/2 px-25">
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
