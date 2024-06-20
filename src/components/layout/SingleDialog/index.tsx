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
    <div className="min-h-screen flex flex-col justify-center bg-gray-4 relative overflow-hidden lg:pb-[2rem] md:pt-[5.563rem] xs:pt-20 lg:pt-[1rem] pt-12 after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-[7px] after:bg-primary">
      <div>
        <div className="block max-w-[8rem] xs:max-w-[11rem] md:max-w-[14rem] mx-auto mb-12 xs:mb-20 md:mx-auto md:mb-20 my-auto overflow-hidden lg:overflow-hidden">
          <Image src={SAPP_Logo} alt="SAPP Logo" priority={true} />
        </div>
        <div className="content">{children}</div>
      </div>
    </div>
  )
}
