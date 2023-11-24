import { ReactElement } from 'react'
import DashboardLayout from './DashboardLayout/DashboardLayout'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: any
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const router = useRouter()
  const selectMode =
    router.asPath.indexOf('teacher') > -1 ? 'teacher' : 'student'
  const { children } = props
  return (
    <>
      <DashboardLayout mode={selectMode}>{children}</DashboardLayout>
    </>
  )
}
