import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import DashboardLayout from './DashboardLayout/DashboardLayout'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
  setOpenResource: Dispatch<SetStateAction<boolean>>
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const router = useRouter()
  const selectMode =
    router.asPath.indexOf('teacher') > -1 ? 'teacher' : 'student'
  const { children, setOpenResource } = props
  return (
    <>
      <DashboardLayout mode={selectMode} setOpenResource={setOpenResource}>{children}</DashboardLayout>
    </>
  )
}
