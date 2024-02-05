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
    <div className="min-h-screen bg-white relative  overflow-hidden lg:pb-[2rem] 2xl:pt-[5.563rem] lg:pt-[1rem] pt-[5.563rem] pb-[7.313rem] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-[7px] after:bg-primary">
      <div className="block max-w-[14rem] mx-auto mb-20 2xl:max-w-[14rem] 2xl:mx-auto 2xl:mb-20 lg:max-w-[10rem] lg:my-4 my-auto overflow-hidden lg:overflow-hidden">
        <Image src={SAPP_Logo} alt="SAPP Logo" />
      </div>
      <div className="content">{children}</div>
    </div>
  )
}
