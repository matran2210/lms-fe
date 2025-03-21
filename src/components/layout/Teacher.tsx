import { ReactElement, ReactNode } from 'react'
import DashboardLayoutTeacher from './DashboardLayout/DashboardLayoutTeacher'
import Head from 'next/head'
import ModalMobile from '@components/base/modal/ModalMobile'

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
      <ModalMobile />
      <DashboardLayoutTeacher title={title}>{children}</DashboardLayoutTeacher>
    </>
  )
}
