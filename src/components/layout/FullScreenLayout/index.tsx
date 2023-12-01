import { ReactElement } from 'react'
import Image from 'next/image'
import SAPP_Logo from '@assets/images/sapp_logo.svg'

interface LayoutProps {
  children: any
}

// eslint-disable-next-line import/no-unused-modules
export default function FullScreenLayout(props: LayoutProps): ReactElement {
  const { children } = props
  return <div className="min-h-screen bg-gray-3">{children}</div>
}
