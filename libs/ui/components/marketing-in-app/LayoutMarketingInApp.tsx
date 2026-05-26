import { memo, useEffect, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import clsx from 'clsx'
import { ValueSidebar } from '@lms/core'
import { SappLoading } from '../common'
import NavigationBarMKTInApp from './NavigationBarMKTInApp'
import SliderHome from './SliderHome'
import FooterMarketingInApp from './FooterMarketingInApp'

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
        {isHome ? (
          <Image
            src={dashboardTab.src}
            alt={dashboardTab.title}
            priority
            fill
            sizes="100vw"
            className={clsx(
              'object-cover transition-opacity duration-700 ease-in-out',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() =>
              setTimeout(() => {
                setLoaded(true)
              }, 500)
            }
          />
        ) : (
          <Image
            src={dashboardTab.src}
            alt={dashboardTab.title}
            priority
            width={1920}
            height={dashboardTab.height}
            sizes="100vw"
            className={clsx(
              'w-full transition-opacity duration-700 ease-in-out',
              loaded ? 'opacity-100' : 'opacity-0',
            )}
            onLoad={() =>
              setTimeout(() => {
                setLoaded(true)
              }, 500)
            }
          />
        )}
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
