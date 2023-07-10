import dynamic from 'next/dynamic'
import { ReactElement } from 'react'

interface LayoutProps {
  children: any
}

const Header = dynamic(() => import('@components/layout/Header'))
const Footer = dynamic(() => import('@components/layout/Footer'))

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const { children } = props
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
