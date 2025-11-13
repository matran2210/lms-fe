import { ReactElement, ReactNode } from 'react'
import Image from 'next/image'
import SAPP_Logo from '@assets/images/sapp_logo.svg'
import Head from 'next/head'

interface LayoutProps {
  children: ReactNode
  title: string
}

// eslint-disable-next-line import/no-unused-modules
export default function SingleDialogLayout(props: LayoutProps): ReactElement {
  const { children, title } = props

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="xs:pt-20 relative flex min-h-screen flex-col justify-center overflow-hidden bg-white pt-12 after:absolute after:bottom-0 after:left-0 after:block after:h-[7px] after:w-full after:bg-primary md:pt-[5.563rem] lg:pb-[2rem] lg:pt-[1rem]">
        <section>
          <div className="xs:mb-12 mx-auto my-auto mb-10 block w-1/2 overflow-hidden sm:max-w-[14rem] md:mx-auto md:mb-20 lg:overflow-hidden">
            <Image
              src={SAPP_Logo}
              alt="SAPP Logo"
              priority={true}
              layout="responsive"
            />
          </div>
          <div className="content">{children}</div>
        </section>
      </div>
    </>
  )
}
