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
    <div className="min-h-screen bg-white relative pt-[5.563rem] pb-[7.313rem] after:absolute after:bottom-0 after:left-0 after:block after:w-full after:h-[0.813rem] after:bg-primary">
      <div className="block max-w-[14rem] mb-20 mx-auto">
        <Image src={SAPP_Logo} alt="SAPP Logo" />
      </div>
      <div className="content">{children}</div>
    </div>
  )
}
