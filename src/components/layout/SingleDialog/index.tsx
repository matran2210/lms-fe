import { ReactElement } from 'react'
import Image from 'next/image'
import SAPP_Logo from '@assets/images/sapp_logo.svg'

interface LayoutProps {
  children: any
}

// eslint-disable-next-line import/no-unused-modules
export default function SingleDialogLayout(props: LayoutProps): ReactElement {
  const { children } = props
  return (
    <div className="min-h-screen flex flex-col justify-center bg-white relative overflow-hidden lg:pb-[2rem] md:pt-[5.563rem] xs:pt-20 lg:pt-[1rem] pt-12 after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-[7px] after:bg-primary">
      <section>
        <div className="block w-1/2 mb-10 sm:max-w-[14rem] mx-auto xs:mb-12 md:mx-auto md:mb-20 my-auto overflow-hidden lg:overflow-hidden">
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
  )
}
