import { ReactElement, ReactNode } from 'react'
import DashboardLayout from './DashboardLayout/DashboardLayout'
import Head from 'next/head'

interface LayoutProps {
  children: ReactNode
  title: string
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const { children, title } = props

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </>
  )
}
