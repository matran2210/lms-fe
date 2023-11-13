import { ReactElement } from 'react'
import DashboardLayout from './DashboardLayout/DashboardLayout'

interface LayoutProps {
  children: any
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const { children } = props
  return (
    <>
      <DashboardLayout>{children}</DashboardLayout>
    </>
  )
}
