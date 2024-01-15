import { Dispatch, ReactElement, ReactNode, SetStateAction } from 'react'
import DashboardLayout from './DashboardLayout/DashboardLayout'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: ReactNode
  setOpenResource: Dispatch<SetStateAction<boolean>>
  openDrawer: boolean
}

// eslint-disable-next-line import/no-unused-modules
export default function Layout(props: LayoutProps): ReactElement {
  const router = useRouter()
  const { children, setOpenResource, openDrawer } = props
  return (
    <>
      <DashboardLayout
        setOpenResource={setOpenResource}
        openDrawer={openDrawer}
      >
        {children}
      </DashboardLayout>
    </>
  )
}
