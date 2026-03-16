import { memo, useEffect, useState } from 'react'
import Head from 'next/head'
import NavigationBarMKTInApp from '@components/marketing-in-app/NavigationBarMKTInApp'
import Image from 'next/image'
import FooterMarketingInApp from '@components/marketing-in-app/FooterMarketingInApp'
import SliderHome from '@components/marketing-in-app/SliderHome'
import clsx from 'clsx'
import { ValueSidebar } from '@lms/core'
import SappLoading from '@components/common/SappLoading'

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
  const isHome = dashboardTab.value === ValueSidebar.HOME
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    setLoaded(false)
  }, [dashboardTab])
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
        {!loaded && <SappLoading />}
        <Image
          src={dashboardTab.src}
          alt={dashboardTab.title}
          priority
          layout={isHome ? 'fill' : 'responsive'}
          objectFit={isHome ? 'cover' : undefined}
          width={!isHome ? 1920 : undefined}
          height={!isHome ? dashboardTab.height : undefined}
          className={clsx(
            'transition-opacity duration-700 ease-in-out',
            loaded ? 'opacity-100' : 'opacity-0',
          )}
          onLoad={() =>
            setTimeout(() => {
              setLoaded(true)
            }, 500)
          }
        />
        <NavigationBarMKTInApp />
        {isHome ? (
          <div className="absolute bottom-32 left-1/2 w-full -translate-x-1/2 px-25 short:bottom-8">
            <SliderHome />
          </div>
        ) : (
          <FooterMarketingInApp />
        )}
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
