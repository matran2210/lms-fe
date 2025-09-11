import DefaultBgImgHeader from '@assets/images/default_bg_mkt_in_app.png'
import { Typography } from 'antd'
import { ITabs } from 'src/type'
import { memo } from 'react'
import clsx from 'clsx'
import Head from 'next/head'
import NavigationBar from '@components/marketing-in-app/NavigationBar'
import Image from 'next/image'

const { Title } = Typography
type LayoutTeacherProps = {
  children: React.ReactNode
  title?: string
  className?: string
  bgImgHeader: string
}

const LayoutMarketingInApp: React.FC<LayoutTeacherProps> = ({
  children,
  title = '',
  className = '',
  bgImgHeader = '',
}: LayoutTeacherProps) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div className={clsx('min-h-screen w-full bg-white')}>
        <div className="relative">
          <Image
            src={bgImgHeader || DefaultBgImgHeader}
            height={849}
            alt="bgImgHeader"
          />
          <NavigationBar />
        </div>
        {children}
        <div className="rotate-180">
          <Image src={DefaultBgImgHeader} height={377} alt="bgImgFooter" />
        </div>
      </div>
    </>
  )
}
export default memo(LayoutMarketingInApp)
